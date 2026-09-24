<?php
/* Funções do painel: sessão, login, conteúdo e uploads.
   Tudo é guardado em arquivos (sem banco de dados):
     data/config.php    usuário e hash da senha (criado no primeiro acesso)
     data/content.json  cases e imagens do site
     data/leads.json    contatos recebidos pelo formulário
     uploads/           imagens e vídeos enviados */

declare(strict_types=1);

date_default_timezone_set('America/Sao_Paulo');

const ROOT = __DIR__ . '/..';
const DATA_DIR = ROOT . '/data';
const UPLOAD_DIR = ROOT . '/uploads';
const CONFIG_FILE = DATA_DIR . '/config.php';
const CONTENT_FILE = DATA_DIR . '/content.json';
const ATTEMPTS_FILE = DATA_DIR . '/login-attempts.json';
const LEADS_FILE = DATA_DIR . '/leads.json';
const LEADS_RATE_FILE = DATA_DIR . '/contact-rate.json';

/* Para onde vão os avisos de contato novo do formulário do site. */
const NOTIFY_EMAIL = 'bowagencydesign@gmail.com';
const CONTACT_MAX_PER_HOUR = 5;

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 2400;
const LOGIN_MAX_FAILS = 5;
const LOGIN_LOCK_SECONDS = 15 * 60;

function json_out($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $msg, int $status = 400): void { json_out(['error' => $msg], $status); }

function start_session(): void {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('bowpainel');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Strict']);
    session_start();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    // Sessão expira após 8 horas.
    if (!empty($_SESSION['user']) && time() - ($_SESSION['since'] ?? 0) > 8 * 3600) {
        $_SESSION = ['csrf' => bin2hex(random_bytes(32))];
    }
}

function ensure_dirs(): void {
    foreach ([DATA_DIR, UPLOAD_DIR] as $d) {
        if (!is_dir($d) && !@mkdir($d, 0755, true)) fail('Não foi possível criar a pasta ' . basename($d) . '. Verifique as permissões no servidor.', 500);
    }
}

function write_atomic(string $file, string $data): void {
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (@file_put_contents($tmp, $data, LOCK_EX) === false || !@rename($tmp, $file)) {
        @unlink($tmp);
        fail('Não foi possível salvar. Verifique as permissões da pasta data/ no servidor.', 500);
    }
}

/* ---------- Login ---------- */

function config(): ?array {
    if (!is_file(CONFIG_FILE)) return null;
    $c = include CONFIG_FILE;
    return is_array($c) ? $c : null;
}

function is_logged(): bool { return !empty($_SESSION['user']); }

function require_login(): void { if (!is_logged()) fail('Sessão expirada. Entre novamente.', 401); }

function require_csrf(): void {
    $t = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($t) || !hash_equals($_SESSION['csrf'] ?? '', $t)) fail('Token inválido. Recarregue a página.', 403);
}

function client_ip(): string { return $_SERVER['REMOTE_ADDR'] ?? 'unknown'; }

function attempts(): array {
    $a = is_file(ATTEMPTS_FILE) ? json_decode((string)@file_get_contents(ATTEMPTS_FILE), true) : [];
    return is_array($a) ? $a : [];
}

function locked_for(): int {
    $a = attempts()[client_ip()] ?? null;
    if (!$a || $a['n'] < LOGIN_MAX_FAILS) return 0;
    return max(0, $a['t'] + LOGIN_LOCK_SECONDS - time());
}

function record_attempt(bool $ok): void {
    $all = attempts();
    $ip = client_ip();
    foreach ($all as $k => $v) if (time() - $v['t'] > LOGIN_LOCK_SECONDS) unset($all[$k]);
    if ($ok) unset($all[$ip]);
    else $all[$ip] = ['n' => ($all[$ip]['n'] ?? 0) + 1, 't' => time()];
    @file_put_contents(ATTEMPTS_FILE, json_encode($all), LOCK_EX);
}

function login_session(string $user): void {
    session_regenerate_id(true);
    $_SESSION['user'] = $user;
    $_SESSION['since'] = time();
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

/* ---------- Conteúdo ---------- */

function load_content(): ?array {
    if (!is_file(CONTENT_FILE)) return null;
    $c = json_decode((string)file_get_contents(CONTENT_FILE), true);
    return is_array($c) ? $c : null;
}

/* Referência de imagem válida: número (foto de banco) ou arquivo enviado em uploads/. */
function valid_ref($r) {
    if (is_int($r) && $r > 0) return $r;
    if (is_string($r) && preg_match('#^uploads/[a-f0-9]{24}\.(jpg|png|webp)$#', $r)) return $r;
    return null;
}

/* Vídeo enviado (MP4 ou WebM) em uploads/. */
function valid_video($r): ?string {
    return is_string($r) && preg_match('#^uploads/[a-f0-9]{24}\.(mp4|webm)$#', $r) ? $r : null;
}

function clean_str($v, int $max): string {
    $s = is_string($v) ? trim(preg_replace('/\s+/u', ' ', $v)) : '';
    return mb_substr($s, 0, $max);
}

function slugify(string $s): string {
    $s = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s) ?: $s;
    $s = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $s));
    return trim($s, '-') ?: 'case';
}

function validate_content($in): array {
    if (!is_array($in)) fail('Conteúdo inválido.');
    $cases = [];
    $slugs = [];
    foreach (array_slice(is_array($in['cases'] ?? null) ? $in['cases'] : [], 0, 60) as $c) {
        if (!is_array($c)) continue;
        $name = clean_str($c['name'] ?? '', 80);
        if ($name === '') fail('Todo case precisa de um nome.');
        $slug = slugify(clean_str($c['slug'] ?? '', 80) ?: $name);
        $base = $slug; $n = 2;
        while (isset($slugs[$slug])) $slug = $base . '-' . $n++;
        $slugs[$slug] = true;
        $imgs = [];
        for ($i = 0; $i < 4; $i++) {
            $r = valid_ref($c['imgs'][$i] ?? null);
            if ($r === null) fail('O case "' . $name . '" precisa das 4 imagens.');
            $imgs[] = $r;
        }
        $deliver = [];
        foreach (array_slice(is_array($c['deliver'] ?? null) ? $c['deliver'] : [], 0, 12) as $d) {
            $d = clean_str($d, 120);
            if ($d !== '') $deliver[] = $d;
        }
        $video = valid_video($c['video'] ?? null);
        $cases[] = [
            'slug' => $slug, 'name' => $name,
            'segment' => clean_str($c['segment'] ?? '', 80), 'services' => clean_str($c['services'] ?? '', 120), 'year' => clean_str($c['year'] ?? '', 10),
            'card' => clean_str($c['card'] ?? '', 140), 'lead' => clean_str($c['lead'] ?? '', 240),
            'challengeH' => clean_str($c['challengeH'] ?? '', 160), 'challenge' => clean_str($c['challenge'] ?? '', 800),
            'solutionH' => clean_str($c['solutionH'] ?? '', 160), 'solution' => clean_str($c['solution'] ?? '', 800),
            'resultH' => clean_str($c['resultH'] ?? '', 160), 'deliver' => $deliver, 'imgs' => $imgs,
        ] + ($video ? ['video' => $video] : []);
    }
    if (!$cases) fail('Deixe pelo menos um case no site.');
    $images = [];
    foreach (is_array($in['images'] ?? null) ? $in['images'] : [] as $k => $v) {
        if (!is_string($k) || !preg_match('/^[a-z]+(\.[a-zA-Z0-9-]+){1,3}$/', $k)) continue;
        // Chaves terminadas em "Video" só aceitam vídeo; as demais, só imagem.
        $r = str_ends_with($k, 'Video') ? valid_video($v) : valid_ref($v);
        if ($r !== null) $images[$k] = $r;
    }
    return ['version' => 1, 'updated' => date('c'), 'cases' => $cases, 'images' => (object)$images];
}

/* Apaga imagens enviadas que não são mais usadas (ignora as da última hora,
   que podem estar num case ainda sendo editado). */
function cleanup_uploads(array $content): void {
    $used = [];
    array_walk_recursive($content, function ($v) use (&$used) { if (is_string($v) && str_starts_with($v, 'uploads/')) $used[basename($v)] = true; });
    foreach (glob(UPLOAD_DIR . '/*') ?: [] as $f) {
        if (!preg_match('/^[a-f0-9]{24}\.(jpg|png|webp|mp4|webm)$/', basename($f))) continue;
        if (!isset($used[basename($f)]) && time() - filemtime($f) > 3600) @unlink($f);
    }
}

/* ---------- Upload ---------- */

function handle_upload(): string {
    $f = $_FILES['file'] ?? null;
    if (!$f && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
        fail('Arquivo maior que o limite do servidor (' . ini_get('post_max_size') . '). Veja o README para aumentar o limite na Hostinger.');
    }
    if (!$f || !is_array($f) || ($f['error'] ?? 1) !== UPLOAD_ERR_OK) {
        $code = is_array($f) ? ($f['error'] ?? 0) : 0;
        fail(in_array($code, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)
            ? 'Arquivo maior que o limite do servidor (' . ini_get('upload_max_filesize') . ').' : 'Falha no envio do arquivo.');
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
    $video = ['video/mp4' => 'mp4', 'video/webm' => 'webm'][$mime] ?? null;
    if ($video) {
        if ($f['size'] > MAX_VIDEO_BYTES) fail('Vídeo grande demais (máximo 80 MB). Exporte em 1080p, com 10 a 20 segundos.');
        $name = bin2hex(random_bytes(12)) . '.' . $video;
        if (!move_uploaded_file($f['tmp_name'], UPLOAD_DIR . '/' . $name)) fail('Não foi possível salvar o vídeo no servidor.', 500);
        return 'uploads/' . $name;
    }
    if (str_starts_with((string)$mime, 'video/')) fail('Use vídeos MP4 ou WebM. Arquivos .MOV do iPhone precisam ser exportados como MP4.');
    if ($f['size'] > MAX_UPLOAD_BYTES) fail('Imagem grande demais (máximo 15 MB).');
    $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$mime] ?? null;
    if (!$ext) fail('Use imagens JPG, PNG ou WebP, ou vídeos MP4.');
    if (!@getimagesize($f['tmp_name'])) fail('Arquivo de imagem inválido.');
    $name = bin2hex(random_bytes(12)) . '.' . $ext;
    $dest = UPLOAD_DIR . '/' . $name;
    if (!reencode($f['tmp_name'], $dest, $ext) && !move_uploaded_file($f['tmp_name'], $dest)) fail('Não foi possível salvar a imagem no servidor.', 500);
    return 'uploads/' . $name;
}

/* Reduz para no máximo 2400 px de largura e regrava a imagem (remove metadados).
   Sem a extensão GD, a imagem é guardada como veio. */
function reencode(string $src, string $dest, string $ext): bool {
    if (!function_exists('imagecreatefromstring')) return false;
    $im = @imagecreatefromstring((string)file_get_contents($src));
    if (!$im) return false;
    $w = imagesx($im); $h = imagesy($im);
    if ($w > MAX_IMAGE_WIDTH) {
        $nh = (int)round($h * MAX_IMAGE_WIDTH / $w);
        $r = imagecreatetruecolor(MAX_IMAGE_WIDTH, $nh);
        imagealphablending($r, false); imagesavealpha($r, true);
        imagecopyresampled($r, $im, 0, 0, 0, 0, MAX_IMAGE_WIDTH, $nh, $w, $h);
        imagedestroy($im); $im = $r;
    }
    $ok = match ($ext) {
        'jpg' => imagejpeg($im, $dest, 85),
        'png' => imagepng($im, $dest, 7),
        'webp' => function_exists('imagewebp') && imagewebp($im, $dest, 85),
    };
    imagedestroy($im);
    return (bool)$ok;
}

/* ---------- Contatos do formulário ---------- */

/* Lê, altera e grava leads.json com o arquivo travado (dois envios ao mesmo tempo não se perdem). */
function with_leads(callable $fn) {
    ensure_dirs();
    $h = @fopen(LEADS_FILE, 'c+');
    if (!$h) fail('Não foi possível salvar o contato no servidor.', 500);
    flock($h, LOCK_EX);
    $leads = json_decode((string)stream_get_contents($h), true);
    if (!is_array($leads)) $leads = [];
    $result = $fn($leads);
    ftruncate($h, 0); rewind($h);
    fwrite($h, json_encode($leads, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    fflush($h); flock($h, LOCK_UN); fclose($h);
    return $result;
}

function load_leads(): array {
    $l = is_file(LEADS_FILE) ? json_decode((string)file_get_contents(LEADS_FILE), true) : [];
    return is_array($l) ? $l : [];
}

/* Limite de envios por IP, para barrar robôs que insistem. */
function contact_rate_ok(): bool {
    $f = LEADS_RATE_FILE;
    $all = is_file($f) ? json_decode((string)@file_get_contents($f), true) : [];
    if (!is_array($all)) $all = [];
    $now = time(); $ip = client_ip();
    foreach ($all as $k => $ts) { $all[$k] = array_values(array_filter((array)$ts, fn($t) => $now - $t < 3600)); if (!$all[$k]) unset($all[$k]); }
    $ok = count($all[$ip] ?? []) < CONTACT_MAX_PER_HOUR;
    if ($ok) $all[$ip][] = $now;
    @file_put_contents($f, json_encode($all), LOCK_EX);
    return $ok;
}

function no_newlines(string $s): string { return trim(str_replace(["\r", "\n"], ' ', $s)); }

/* Aviso por e-mail. Sai pelo servidor do site; se falhar, o contato continua salvo no painel. */
function notify_lead(array $lead): bool {
    if (!function_exists('mail')) return false;
    $host = preg_replace('/^www\./', '', strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? 'localhost')[0]));
    if (!preg_match('/^[a-z0-9.-]+$/', $host)) $host = 'localhost';
    $subject = '=?UTF-8?B?' . base64_encode('Novo contato pelo site: ' . no_newlines($lead['name'])) . '?=';
    $lines = [
        'Novo contato pelo formulário do site da Bow.', '',
        'Nome: ' . $lead['name'],
        'Empresa: ' . ($lead['company'] ?: '-'),
        'E-mail: ' . ($lead['email'] ?: '-'),
        'WhatsApp: ' . ($lead['phone'] ?: '-'),
        'Página: ' . ($lead['page'] ?: '-'),
        'Data: ' . date('d/m/Y H:i', strtotime($lead['date'])), '',
        'Veja todos os contatos no painel do site, aba Contatos.',
    ];
    if ($lead['phone']) $lines[] = 'Responder no WhatsApp: https://wa.me/' . wa_digits($lead['phone']);
    $headers = [
        'From: Site Bow <no-reply@' . $host . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: Site Bow',
    ];
    if ($lead['email']) $headers[] = 'Reply-To: ' . no_newlines($lead['email']);
    return @mail(NOTIFY_EMAIL, $subject, implode("\r\n", $lines), implode("\r\n", $headers), '-f no-reply@' . $host);
}

/* Número para link do WhatsApp: só dígitos, com 55 na frente quando for número brasileiro sem DDI. */
function wa_digits(string $phone): string {
    $d = preg_replace('/\D+/', '', $phone);
    return strlen($d) <= 11 ? '55' . $d : $d;
}
