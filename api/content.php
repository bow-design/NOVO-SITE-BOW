<?php
/* Conteúdo público do site (cases, imagens e faixa de clientes), salvo pelo painel. */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache');
$file = __DIR__ . '/../data/content.json';
if (!is_file($file)) { echo '{}'; exit; }
$c = json_decode((string)file_get_contents($file), true);
if (!is_array($c)) { echo '{}'; exit; }
echo json_encode(['cases' => $c['cases'] ?? [], 'images' => (object)($c['images'] ?? []), 'clients' => $c['clients'] ?? null, 'tracking' => (object)($c['tracking'] ?? [])], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
