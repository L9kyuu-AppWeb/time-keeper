<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $timeLeft = $_POST['time'];
    // Simpan atau proses waktu tersisa di sini
    echo json_encode(['status' => 'success', 'timeLeft' => $timeLeft]);
}
