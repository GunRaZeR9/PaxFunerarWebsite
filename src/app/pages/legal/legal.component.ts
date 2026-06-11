import { Component, inject, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { SeoService } from '../../core/services/seo.service';

const LEGAL_CONTENT: Record<string, { title: string; body: string }> = {
  'politica-de-confidentialitate': {
    title: 'Politică de Confidențialitate',
    body: `<h2>1. Informații generale</h2>
<p>Casa Funerară PAX colectează și procesează datele dumneavoastră personale în conformitate cu Regulamentul (UE) 2016/679 (GDPR) și legislația națională aplicabilă.</p>
<h2>2. Date colectate</h2>
<p>Colectăm datele pe care ni le furnizați prin formularul de contact: nume, email, telefon, mesaj. Aceste date sunt folosite exclusiv pentru a răspunde solicitărilor dumneavoastră.</p>
<h2>3. Drepturi</h2>
<p>Aveți dreptul de acces, rectificare, ștergere, restricționare a prelucrării și portabilitate a datelor. Pentru exercitarea acestor drepturi, contactați-ne la contact@paxfunerar.ro.</p>
<h2>4. Contact DPO</h2>
<p>Pentru orice întrebare privind prelucrarea datelor: contact@paxfunerar.ro | 0745 547 530</p>`,
  },
  'politica-de-cookies': {
    title: 'Politică de Cookies',
    body: `<h2>Ce sunt cookie-urile?</h2>
<p>Cookie-urile sunt fișiere mici stocate pe dispozitivul dumneavoastră atunci când vizitați un site web. Acestea ajută la funcționarea corectă a site-ului.</p>
<h2>Cookie-uri utilizate</h2>
<p>Utilizăm cookie-uri tehnice esențiale pentru funcționarea site-ului (preferința limbii, sesiune). Nu utilizăm cookie-uri de tracking sau publicitate terță.</p>
<h2>Gestionare</h2>
<p>Puteți dezactiva cookie-urile din setările browserului. Dezactivarea cookie-urilor esențiale poate afecta funcționalitatea site-ului.</p>`,
  },
  'termeni-si-conditii': {
    title: 'Termeni și Condiții',
    body: `<h2>1. Utilizarea site-ului</h2>
<p>Prin accesarea site-ului paxfunerar.ro, acceptați acești termeni și condiții. Site-ul este furnizat "ca atare" și poate fi modificat oricând.</p>
<h2>2. Produse și servicii</h2>
<p>Prețurile afișate sunt orientative. Prețurile finale se stabilesc la cerere, în funcție de specificul serviciului solicitat. Casa Funerară PAX își rezervă dreptul de a modifica prețurile fără notificare prealabilă.</p>
<h2>3. Proprietate intelectuală</h2>
<p>Tot conținutul acestui site (texte, imagini, logo) este proprietatea Casa Funerară PAX și este protejat de legile drepturilor de autor.</p>`,
  },
  'politica-de-reclamatii': {
    title: 'Politică de Reclamații',
    body: `<h2>Procedura de reclamații</h2>
<p>Orice reclamație referitoare la serviciile sau produsele noastre poate fi transmisă prin:</p>
<ul>
<li>Email: contact@paxfunerar.ro</li>
<li>Telefon: 0745 547 530</li>
<li>Poștă: Strada Alexandru Papiu Ilarian 10, Târgu Mureș</li>
</ul>
<h2>Termen de soluționare</h2>
<p>Reclamațiile vor fi analizate și soluționate în termen de 30 de zile calendaristice de la data primirii.</p>`,
  },
  'politica-clienti': {
    title: 'Politică Clienți',
    body: `<h2>Angajamentele noastre față de clienți</h2>
<p>Casa Funerară PAX se angajează să ofere servicii de cea mai înaltă calitate, tratând fiecare client cu empatie, respect și profesionalism.</p>
<h2>Standardele noastre</h2>
<ul>
<li>Răspuns la apeluri în maxim 5 minute</li>
<li>Preluare non-stop, 24/7</li>
<li>Transparență totală în privința costurilor</li>
<li>Personal certificat și instruit</li>
<li>Respectarea tradițiilor și dorințelor familiei</li>
</ul>`,
  },
};

@Component({
  selector: 'pax-legal',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero">
      <div class="container">
        <h1>{{ page()?.title }}</h1>
      </div>
    </section>
    <section class="legal-body">
      <div class="container legal-content" [innerHTML]="page()?.body"></div>
    </section>
    <div class="container back-section">
      <a routerLink="/" class="back-link">← Înapoi acasă</a>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;
    .page-hero { background: var(--gradient-hero); padding-block: var(--space-12); }
    h1 { font-size: var(--text-3xl); }
    .legal-body { padding-block: var(--space-12); }
    .legal-content { max-width: 800px; line-height: 1.8; }
    :host ::ng-deep {
      h2 { font-size: var(--text-xl); margin-block: var(--space-8) var(--space-4); }
      p { color: var(--color-text-secondary); margin-bottom: var(--space-4); }
      ul { color: var(--color-text-secondary); padding-left: var(--space-6); }
      li { margin-bottom: var(--space-2); }
    }
    .back-section { padding-bottom: var(--space-12); }
    .back-link { font-size: var(--text-sm); color: var(--color-text-muted); }
    .back-link:hover { color: var(--color-accent); }
  `],
})
export class LegalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  private readonly slug = toSignal(
    this.route.data.pipe(map((d: { slug?: string }) => d['slug'] ?? '')),
    { initialValue: '' },
  );

  readonly page = computed(() => LEGAL_CONTENT[this.slug()] ?? null);

  ngOnInit(): void {
    const p = this.page();
    if (p) {
      this.seo.setPage({
        title: `${p.title} | Casa Funerară PAX`,
        description: `${p.title} — Casa Funerară PAX Târgu Mureș`,
        canonical: `https://paxfunerar.ro/${this.slug()}`,
      });
    }
  }
}
