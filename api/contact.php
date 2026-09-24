<?php
/* Recebe o formulário de contato do site: salva o contato (aba Contatos do painel)
   e manda um aviso por e-mail. */

declare(strict_types=1);
require __DIR__ . '/../painel/lib.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Método inválido.', 405);
// Só aceita JSON: um formulário de outro site não consegue enviar esse formato sem autorização.
if (!str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) fail('Formato inválido.', 415);
$in = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($in)) fail('Dados inválidos.');

// Robôs: preenchem o campo invisível ou enviam rápido demais. Recebem "ok" e nada é salvo.
$elapsed = (int)($in['elapsed'] ?? 0);
if (!empty($in['website']) || $elapsed < 2500) json_out(['ok' => true]);

$name = clean_str($in['name'] ?? '', 80);
$company = clean_str($in['company'] ?? '', 120);
$email = clean_str($in['email'] ?? '', 120);
$phone = clean_str($in['phone'] ?? '', 30);
$page = clean_str($in['page'] ?? '', 120);

if ($name === '') fail('Coloque seu nome.');
if ($email === '' && $phone === '') fail('Deixe um e-mail ou WhatsApp para a gente responder.');
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Confira o e-mail.');
$digits = preg_replace('/\D+/', '', $phone);
if ($phone !== '' && (strlen($digits) < 10 || strlen($digits) > 13)) fail('Confira o WhatsApp, com DDD.');
if (!contact_rate_ok()) fail('Muitos envios seguidos. Tente de novo mais tarde ou fale pelo WhatsApp.', 429);

$lead = [
    'id' => bin2hex(random_bytes(8)), 'date' => date('c'),
    'name' => $name, 'company' => $company, 'email' => $email, 'phone' => $phone, 'page' => $page,
    'done' => false,
];
$lead['mailed'] = notify_lead($lead);
with_leads(function (&$leads) use ($lead) {
    array_unshift($leads, $lead);
    $leads = array_slice($leads, 0, 5000);
});
json_out(['ok' => true]);
