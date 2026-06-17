<?php
// WooCommerce API Proxy — holds credentials server-side
// NEVER expose consumer_secret in Angular
//
// Upload to: wp.sellmotion.ro/proxy.php
// See WOOCOMMERCE_INTEGRATION.md Phase 1.1 for context.
// Replace WC_CK / WC_CS below with the WooCommerce Write key before uploading,
// or better: load them from a config.php outside the web root.

$allowedOrigins = [
    'https://sellmotion.ro',
    'https://www.sellmotion.ro',
    'https://gunrazer9.github.io',
    'http://localhost:4200',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('WC_URL', 'https://wp.sellmotion.ro/wp-json/wc/v3');
define('WC_CK', 'ck_1f0c3b53f15a73ae4ca5d4789cc7a9d416f19aeb');
define('WC_CS', 'cs_a3d16db2597af6454c2d5a51981cf30c2a9e5e66');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create_order':
        handleCreateOrder();
        break;
    case 'get_order':
        handleGetOrder($_GET['order_id'] ?? '');
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

function wcRequest(string $endpoint, string $method = 'GET', array $body = []): array {
    $ch = curl_init();
    $url = WC_URL . $endpoint;

    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD        => WC_CK . ':' . WC_CS,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_CUSTOMREQUEST  => $method,
    ]);

    if ($method === 'POST' && !empty($body)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['status' => $httpCode, 'body' => json_decode($response, true)];
}

function handleCreateOrder(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['line_items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'line_items required']);
        return;
    }

    $method = $input['payment_method'] ?? 'cod';
    $isCod  = $method === 'cod';

    $orderPayload = [
        'set_paid'       => false,
        'status'         => $isCod ? 'processing' : 'pending',
        'billing'        => $input['billing'] ?? [],
        'shipping'       => $input['billing'] ?? [],
        'line_items'     => $input['line_items'],
        'shipping_lines' => [[
            'method_id'    => 'flat_rate',
            'method_title' => 'Livrare',
            'total'        => '25.00',
        ]],
        'meta_data'      => [
            ['key' => '_pax_lang', 'value' => $input['lang'] ?? 'ro'],
        ],
    ];

    if ($isCod) {
        $orderPayload['payment_method']       = 'cod';
        $orderPayload['payment_method_title'] = 'Plată ramburs (la livrare)';
    }

    $result = wcRequest('/orders', 'POST', $orderPayload);

    http_response_code($result['status']);
    echo json_encode($result['body']);
}

function handleGetOrder(string $orderId): void {
    if (empty($orderId) || !is_numeric($orderId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid order_id']);
        return;
    }

    $result = wcRequest('/orders/' . intval($orderId));
    http_response_code($result['status']);
    echo json_encode($result['body']);
}