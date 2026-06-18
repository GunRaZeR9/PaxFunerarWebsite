#!/usr/bin/env bash
#
# setup-wp.sh — one-shot WordPress cutover for the PaxFunerar theme.
#
# Creates the 17 Pages with the correct slugs + parent/template assignments,
# renames the WooCommerce Shop page slug to `magazin`, and flushes rewrites —
# everything in README.md's "Required wp-admin setup", automated.
#
# Requirements: WP-CLI (https://wp-cli.org), the PaxFunerar theme active,
# WooCommerce active. Run from the WordPress root, or pass --path=/var/www/...
#
# Usage:
#   bash setup-wp.sh                 # run in the WP root
#   bash setup-wp.sh --path=/srv/wp  # or point at the install
#
# Idempotent: re-running updates existing pages (matched by slug) instead of
# creating duplicates.

set -euo pipefail

WP_PATH_ARG=""
for arg in "$@"; do
  case "$arg" in
    --path=*) WP_PATH_ARG="$arg" ;;
  esac
done

wp() { command wp ${WP_PATH_ARG:+"$WP_PATH_ARG"} "$@"; }

log() { printf '  %s\n' "$*" >&2; }

if ! command -v wp >/dev/null 2>&1; then
  echo "ERROR: WP-CLI (wp) not found in PATH." >&2
  exit 1
fi

# get_page_id <slug>  -> prints the page ID or empty
get_page_id() {
  wp post list --post_type=page --name="$1" --post_status=any \
    --field=ID --posts_per_page=1 2>/dev/null | head -n1
}

# ensure_page <slug> <title> [template] [parent_id]  -> prints the page ID
ensure_page() {
  local slug="$1" title="$2" template="${3:-}" parent="${4:-0}"
  local id
  id="$(get_page_id "$slug")"
  if [ -z "$id" ]; then
    id="$(wp post create --post_type=page --post_status=publish \
            --post_title="$title" --post_name="$slug" --post_parent="$parent" \
            --porcelain)"
    log "created  $slug  (#$id)"
  else
    wp post update "$id" --post_parent="$parent" >/dev/null
    log "updated  $slug  (#$id)"
  fi
  if [ -n "$template" ]; then
    wp post meta update "$id" _wp_page_template "$template" >/dev/null
  fi
  printf '%s' "$id"
}

echo "==> PaxFunerar — WordPress page setup"

# --- Top-level pages (templates auto-attach by slug: page-{slug}.php) ---
SERVICII_ID="$(ensure_page servicii-funerare 'Servicii Funerare')"
ensure_page contact     'Contact'    >/dev/null
ensure_page despre-noi  'Despre Noi' >/dev/null

# --- 10 service child pages (Template: Service Detail) ---
# slug|Title  — slugs MUST match inc/services-data.php
SERVICES=(
  "intocmirea-actelor|Întocmirea Actelor"
  "transport-funerar|Transport Funerar"
  "imbalsamare|Îmbălsămare"
  "servicii-ceremoniale|Servicii Ceremoniale"
  "servicii-de-catering|Servicii de Catering"
  "repatriere-decedati|Repatriere Decedați"
  "capela|Capelă"
  "pregatire-loc-de-veci|Pregătire Loc de Veci"
  "incinerare|Incinerare"
  "fotoceramica|Fotoceramică"
)
for entry in "${SERVICES[@]}"; do
  slug="${entry%%|*}"; title="${entry#*|}"
  ensure_page "$slug" "$title" "page-service-detail.php" "$SERVICII_ID" >/dev/null
done

# --- 5 legal pages (Template: Legal Page) ---
LEGAL=(
  "politica-de-confidentialitate|Politica de confidențialitate"
  "politica-de-cookies|Politica de cookies"
  "termeni-si-conditii|Termeni și condiții"
  "politica-de-reclamatii|Politica de reclamații"
  "politica-clienti|Politica clienți"
)
for entry in "${LEGAL[@]}"; do
  slug="${entry%%|*}"; title="${entry#*|}"
  ensure_page "$slug" "$title" "page-legal.php" 0 >/dev/null
done

# --- WooCommerce Shop page → slug `magazin` ---
SHOP_ID="$(wp option get woocommerce_shop_page_id 2>/dev/null || true)"
if [ -n "${SHOP_ID:-}" ] && [ "$SHOP_ID" != "0" ]; then
  CUR_SLUG="$(wp post get "$SHOP_ID" --field=post_name 2>/dev/null || true)"
  if [ "$CUR_SLUG" != "magazin" ]; then
    wp post update "$SHOP_ID" --post_name=magazin >/dev/null
    log "shop page (#$SHOP_ID) slug -> magazin"
  else
    log "shop page (#$SHOP_ID) slug already 'magazin'"
  fi
else
  log "WARNING: WooCommerce shop page not found — set it in WooCommerce → Settings → Advanced"
fi

# --- Flush permalinks so the new hierarchy resolves ---
wp rewrite structure '/%postname%/' --hard >/dev/null 2>&1 || true
wp rewrite flush --hard >/dev/null
log "permalinks flushed"

echo "==> Done. Visit /servicii-funerare/transport-funerar/ and /magazin/ to verify."
echo "    (Front page is rendered by front-page.php automatically — no Reading setting needed.)"
