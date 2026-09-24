<?php
/* API do painel. Todas as ações de escrita exigem login e o token CSRF. */

declare(strict_types=1);
require __DIR__ . '/lib.php';

start_session();
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$body = $method === 'POST' && str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')
    ? (json_decode((string)file_get_contents('php://input'), true) ?: []) : [];

if ($method === 'GET' && $action === 'status') {
    json_out(['setup' => config() === null, 'logged' => is_logged(), 'user' => $_SESSION['user'] ?? null, 'csrf' => $_SESSION['csrf']]);
}

if ($method === 'GET' && $action === 'leads_csv') {
    require_login();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="contatos-bow-' . date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF"); // acentos certos no Excel
    fputcsv($out, ['Data', 'Nome', 'Empresa', 'E-mail', 'WhatsApp', 'Página', 'Respondido'], ';');
    foreach (load_leads() as $l) {
        // Evita que o Excel interprete um campo como fórmula.
        $row = array_map(fn($v) => preg_match('/^[=+\-@]/', (string)$v) ? "'" . $v : $v,
            [date('d/m/Y H:i', strtotime($l['date'])), $l['name'], $l['company'], $l['email'], $l['phone'], $l['page'], empty($l['done']) ? 'Não' : 'Sim']);
        fputcsv($out, $row, ';');
    }
    exit;
}

if ($method !== 'POST') fail('Método inválido.', 405);
require_csrf();

switch ($action) {
    case 'setup': {
        // Primeiro acesso: cria o usuário. Depois disso, esta ação fica bloqueada.
        ensure_dirs();
        if (config() !== null) fail('O acesso já foi configurado.', 403);
        $user = clean_str($body['user'] ?? '', 60);
        $pass = is_string($body['password'] ?? null) ? $body['password'] : '';
        if ($user === '') fail('Escolha um usuário.');
        if (mb_strlen($pass) < 10) fail('A senha precisa ter pelo menos 10 caracteres.');
        $cfg = "<?php\nreturn " . var_export(['user' => $user, 'hash' => password_hash($pass, PASSWORD_DEFAULT)], true) . ";\n";
        write_atomic(CONFIG_FILE, $cfg);
        login_session($user);
        json_out(['ok' => true, 'csrf' => $_SESSION['csrf']]);
    }
    case 'login': {
        ensure_dirs();
        $cfg = config();
        if (!$cfg) fail('Acesso ainda não configurado.', 403);
        if ($wait = locked_for()) fail('Muitas tentativas. Tente de novo em ' . ceil($wait / 60) . ' min.', 429);
        $user = is_string($body['user'] ?? null) ? trim($body['user']) : '';
        $pass = is_string($body['password'] ?? null) ? $body['password'] : '';
        $ok = hash_equals($cfg['user'], $user) && password_verify($pass, $cfg['hash']);
        record_attempt($ok);
        if (!$ok) { usleep(400000); fail('Usuário ou senha incorretos.', 401); }
        login_session($user);
        json_out(['ok' => true, 'csrf' => $_SESSION['csrf']]);
    }
    case 'logout': {
        $_SESSION = [];
        session_destroy();
        json_out(['ok' => true]);
    }
    case 'password': {
        require_login();
        $cfg = config();
        $cur = is_string($body['current'] ?? null) ? $body['current'] : '';
        $new = is_string($body['password'] ?? null) ? $body['password'] : '';
        if (!password_verify($cur, $cfg['hash'])) fail('Senha atual incorreta.', 401);
        if (mb_strlen($new) < 10) fail('A nova senha precisa ter pelo menos 10 caracteres.');
        $cfg['hash'] = password_hash($new, PASSWORD_DEFAULT);
        write_atomic(CONFIG_FILE, "<?php\nreturn " . var_export($cfg, true) . ";\n");
        json_out(['ok' => true]);
    }
    case 'get': {
        require_login();
        json_out(['content' => load_content()]);
    }
    case 'save': {
        require_login();
        ensure_dirs();
        $content = validate_content($body['content'] ?? null);
        write_atomic(CONTENT_FILE, json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        cleanup_uploads($content);
        json_out(['ok' => true, 'content' => $content]);
    }
    case 'leads': {
        require_login();
        json_out(['leads' => load_leads()]);
    }
    case 'lead_update': {
        require_login();
        $id = (string)($body['id'] ?? '');
        $done = !empty($body['done']);
        with_leads(function (&$leads) use ($id, $done) { foreach ($leads as &$l) if ($l['id'] === $id) $l['done'] = $done; });
        json_out(['ok' => true]);
    }
    case 'lead_delete': {
        require_login();
        $id = (string)($body['id'] ?? '');
        with_leads(function (&$leads) use ($id) { $leads = array_values(array_filter($leads, fn($l) => $l['id'] !== $id)); });
        json_out(['ok' => true]);
    }
    case 'upload': {
        require_login();
        ensure_dirs();
        json_out(['ok' => true, 'path' => handle_upload()]);
    }
}
fail('Ação inválida.', 404);
