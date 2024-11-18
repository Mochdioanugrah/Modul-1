<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Tangani permintaan OPTIONS agar tidak memblokir metode lain
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Content-Type: application/json');
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$orders = [];

// Baca file orders.json jika ada
if (file_exists('orders.json')) {
    $orders = json_decode(file_get_contents('orders.json'), true);
}

// Fungsi untuk menyimpan pesanan ke file JSON
function saveOrders($orders) {
    file_put_contents('orders.json', json_encode($orders, JSON_PRETTY_PRINT));
}

// Fungsi untuk membuat ID unik baru
function generateUniqueId($orders) {
    return count($orders) > 0 ? max(array_column($orders, 'id')) + 1 : 1;
}

// Fungsi untuk mendapatkan input JSON dengan validasi
function getJsonInput() {
    $input = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid JSON']);
        exit;
    }
    return $input;
}

$input = null;
// Jika ada input JSON, baca dan simpan dalam $input
if ($method !== 'GET') {
    $input = getJsonInput();

    // Jika ada _method di input, override $method
    if (isset($input['_method'])) {
        $method = strtoupper($input['_method']);
    }
}

switch ($method) {
    case 'GET':
        // Tampilkan semua pesanan
        header('Content-Type: application/json');
        echo json_encode($orders);
        break;

    case 'POST':
        // Tambahkan pesanan baru
        if (empty($input['customerName']) || empty($input['address']) || !isset($input['quantity'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid input data']);
            exit;
        }

        $newOrder = [
            'id' => generateUniqueId($orders),
            'customerName' => $input['customerName'],
            'address' => $input['address'],
            'quantity' => $input['quantity'],
        ];
        $orders[] = $newOrder;
        saveOrders($orders);
        echo json_encode(['message' => 'Order added']);
        break;

    case 'PUT':
        // Perbarui pesanan yang ada
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing ID']);
            exit;
        }

        // Cari pesanan berdasarkan ID dan perbarui
        foreach ($orders as &$order) {
            if ($order['id'] === $input['id']) {
                $order['customerName'] = $input['customerName'];
                $order['address'] = $input['address'];
                $order['quantity'] = $input['quantity'];
                saveOrders($orders);
                echo json_encode(['message' => 'Order updated']);
                exit;
            }
        }
        http_response_code(404);
        echo json_encode(['message' => 'Order not found']);
        break;

    case 'DELETE':
        // Hapus pesanan berdasarkan ID
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing ID']);
            exit;
        }

        // Filter pesanan berdasarkan ID dan hapus
        $orders = array_filter($orders, fn($order) => $order['id'] !== $input['id']);
        saveOrders(array_values($orders));
        echo json_encode(['message' => 'Order deleted']);
        break;

    default:
        // Tanggapi metode HTTP yang tidak diizinkan
        http_response_code(405);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Method not allowed']);
}
