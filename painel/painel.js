/* Painel da Bow: login, cases e imagens do site.
   Os padrões (cases de exemplo, fotos originais) vêm de ../js/data.js. */

const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const h = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CASE_IMGS = ["Capa (também vai no card)", "Galeria: foto larga", "Galeria: vertical 1", "Galeria: vertical 2"];
const DEFAULT_CASES = JSON.parse(JSON.stringify(CASES));

const asObj = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

let csrf = "";
let setupMode = false;
const content = { cases: [], images: {}, clients: [], tracking: {} };
const DEFAULT_CLIENTS = JSON.parse(JSON.stringify(CLIENTS));

/* Imagem para pré-visualização: número = foto de banco; texto = arquivo enviado. */
const preview = (ref) => ref == null ? "" : typeof ref === "string" ? "../" + ref : px(ref, 600);
const videoTag = (ref) => '<video src="' + h(preview(ref)) + '" muted loop playsinline autoplay></video>';
const MAX_VIDEO_MB = 80;

/* ---------- API ---------- */
async function api(action, data, form) {
  const opts = { method: data === undefined && !form ? "GET" : "POST", credentials: "same-origin", headers: { "X-CSRF-Token": csrf } };
  if (form) opts.body = form;
  else if (data !== undefined) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(data); }
  let res, j;
  try { res = await fetch("api.php?action=" + action, opts); } catch (e) { throw new Error("Sem conexão com o servidor."); }
  try { j = await res.json(); }
  catch (e) { throw new Error(res.status === 413 ? "Arquivo maior que o limite do servidor." : "Resposta inválida do servidor. O painel precisa de PHP (hospedagem Hostinger)."); }
  if (res.status === 401 && action !== "login") { showAuth(); }
  if (!res.ok || j.error) throw new Error(j.error || "Erro " + res.status);
  if (j.csrf) csrf = j.csrf;
  return j;
}

let toastT = 0;
function toast(msg, bad) {
  const t = $("#toast");
  t.textContent = msg; t.classList.toggle("bad", !!bad); t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), bad ? 5000 : 2200);
}

/* Envia com barra de progresso (vídeos podem ser grandes). */
function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "api.php?action=upload");
    xhr.setRequestHeader("X-CSRF-Token", csrf);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round(e.loaded / e.total * 100)); };
    xhr.onerror = () => reject(new Error("A conexão caiu durante o envio."));
    xhr.onload = () => {
      let j = null;
      try { j = JSON.parse(xhr.responseText); } catch (e) {}
      if (xhr.status === 401) showAuth();
      if (xhr.status >= 200 && xhr.status < 300 && j && j.path) resolve(j.path);
      else reject(new Error((j && j.error) || (xhr.status === 413 ? "Arquivo maior que o limite do servidor." : "Falha no envio (erro " + xhr.status + ").")));
    };
    const fd = new FormData(); fd.append("file", file);
    xhr.send(fd);
  });
}

/* Escolhe um arquivo (imagem ou vídeo), envia e devolve o caminho salvo (ou null). */
function pickAndUpload(btn, kind) {
  return new Promise((resolve) => {
    const input = $("#file");
    input.accept = kind === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp";
    input.value = "";
    input.onchange = async () => {
      const f = input.files[0];
      if (!f) return resolve(null);
      if (kind === "video" && f.size > MAX_VIDEO_MB * 1024 * 1024) { toast("Vídeo grande demais (máximo " + MAX_VIDEO_MB + " MB). Exporte em 1080p, com 10 a 20 segundos.", true); return resolve(null); }
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = "Enviando…";
      try {
        const path = await uploadFile(f, (pc) => { btn.textContent = "Enviando " + pc + "%"; });
        const isVideo = /\.(mp4|webm)$/.test(path);
        if (isVideo !== (kind === "video")) throw new Error(kind === "video" ? "Aqui vai um vídeo (MP4 ou WebM)." : "Aqui vai uma imagem (JPG, PNG ou WebP).");
        resolve(path);
      }
      catch (e) { toast(e.message, true); resolve(null); }
      finally { btn.disabled = false; btn.textContent = label; }
    };
    input.click();
  });
}

async function saveAll(msg) {
  try {
    const j = await api("save", { content });
    content.cases = j.content.cases; content.images = asObj(j.content.images); content.clients = j.content.clients || []; content.tracking = asObj(j.content.tracking);
    render();
    toast(msg || "Salvo. Já está no site.");
    return true;
  } catch (e) { toast(e.message, true); return false; }
}

/* ---------- Login ---------- */
function showAuth() {
  $("#app").hidden = true; $("#auth").hidden = false;
  $("#auth-title").textContent = setupMode ? "Primeiro acesso" : "Entrar no painel";
  $("#auth-sub").textContent = setupMode ? "Crie o usuário e a senha que vão proteger o painel. Guarde bem: só eles abrem esta página." : "Acesso restrito à equipe Bow.";
  $("#auth-confirm").hidden = !setupMode;
  $("#auth-btn").textContent = setupMode ? "Criar acesso" : "Entrar";
  $("#auth-form [name=password]").autocomplete = setupMode ? "new-password" : "current-password";
}

$("#auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target, err = $("#auth-err");
  err.textContent = "";
  const user = f.user.value.trim(), password = f.password.value;
  if (setupMode) {
    if (password.length < 10) { err.textContent = "A senha precisa ter pelo menos 10 caracteres."; return; }
    if (password !== f.confirm.value) { err.textContent = "As senhas não são iguais."; return; }
  }
  $("#auth-btn").disabled = true;
  try {
    await api(setupMode ? "setup" : "login", { user, password });
    setupMode = false; f.reset();
    await openApp();
  } catch (ex) { err.textContent = ex.message; }
  finally { $("#auth-btn").disabled = false; }
});

async function openApp() {
  const j = await api("get", {});
  content.cases = j.content && j.content.cases ? j.content.cases : JSON.parse(JSON.stringify(DEFAULT_CASES));
  content.images = asObj(j.content && j.content.images);
  content.tracking = asObj(j.content && j.content.tracking);
  content.clients = j.content && Array.isArray(j.content.clients) ? j.content.clients : JSON.parse(JSON.stringify(DEFAULT_CLIENTS));
  $("#auth").hidden = true; $("#app").hidden = false;
  render();
  await loadLeads();
}

$("#btn-logout").addEventListener("click", async () => { try { await api("logout", {}); } catch (e) {} location.reload(); });

/* ---------- Abas ---------- */
$$(".tab").forEach((t) => t.addEventListener("click", () => {
  $$(".tab").forEach((x) => x.classList.toggle("is-on", x === t));
  $$("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== t.dataset.tab; });
}));

function render() { renderCases(); renderSlots(); renderClients(); renderTracking(); }

/* ---------- Rastreamento ---------- */
function renderTracking() {
  const f = $("#track-form");
  ["clarity", "ga4", "metaPixel"].forEach((k) => {
    if (document.activeElement !== f[k]) f[k].value = content.tracking[k] || "";
    const b = $('[data-track-status="' + k + '"]');
    b.textContent = content.tracking[k] ? "Ativo" : "Desligado";
    b.classList.toggle("off", !content.tracking[k]);
  });
}

$("#track-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target, before = Object.assign({}, content.tracking);
  content.tracking = {};
  ["clarity", "ga4", "metaPixel"].forEach((k) => { const v = f[k].value.trim(); if (v) content.tracking[k] = v; });
  if (!(await saveAll("Rastreamento salvo. Já vale para quem aceitar os cookies."))) content.tracking = before;
});

/* ---------- Clientes (faixa de logos) ---------- */
function renderClients() {
  const L = content.clients, n = L.length;
  $("#client-list").innerHTML = n ? L.map((c, i) =>
    '<li class="client-row">' +
      '<div class="client-logo">' + (c.logo ? '<img src="' + h(preview(c.logo)) + '" alt="">' : '<span class="muted">Sem logo</span>') + "</div>" +
      '<input class="client-name" data-cname="' + i + '" value="' + h(c.name) + '" maxlength="60" aria-label="Nome do cliente">' +
      '<div class="case-actions">' +
        '<button class="icon-btn" data-cup="' + i + '"' + (i === 0 ? " disabled" : "") + ' title="Subir">↑</button>' +
        '<button class="icon-btn" data-cdown="' + i + '"' + (i === n - 1 ? " disabled" : "") + ' title="Descer">↓</button>' +
        '<button class="btn btn-ghost sm" data-clogo="' + i + '">' + (c.logo ? "Trocar logo" : "Enviar logo") + "</button>" +
        (c.logo ? '<button class="btn btn-link sm" data-cnologo="' + i + '">Tirar logo</button>' : "") +
        '<button class="btn btn-danger sm" data-cdel="' + i + '">Remover</button>' +
      "</div></li>").join("")
    : '<li class="empty muted">Nenhum cliente na faixa. Sem clientes, a faixa some do site.</li>';
}

$("#btn-new-client").addEventListener("click", async () => {
  const name = (prompt("Nome do cliente:") || "").trim();
  if (!name) return;
  content.clients.push({ name: name.slice(0, 60) });
  await saveAll("Cliente adicionado. Envie a logo dele.");
});

$("#client-list").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const L = content.clients, d = b.dataset;
  if (d.cup) { const i = +d.cup; [L[i - 1], L[i]] = [L[i], L[i - 1]]; await saveAll("Ordem salva."); }
  else if (d.cdown) { const i = +d.cdown; [L[i + 1], L[i]] = [L[i], L[i + 1]]; await saveAll("Ordem salva."); }
  else if (d.clogo) { const path = await pickAndUpload(b, "image"); if (path) { L[+d.clogo].logo = path; await saveAll("Logo salva."); } }
  else if (d.cnologo) { delete L[+d.cnologo].logo; await saveAll("Logo retirada. Agora aparece o nome."); }
  else if (d.cdel) {
    const i = +d.cdel;
    if (!confirm('Tirar "' + L[i].name + '" da faixa de clientes?')) return;
    const removed = L.splice(i, 1);
    if (!(await saveAll("Cliente removido."))) L.splice(i, 0, removed[0]);
  }
});

// Nome editado direto na lista: salva ao sair do campo.
$("#client-list").addEventListener("change", async (e) => {
  const inp = e.target.closest("[data-cname]");
  if (!inp) return;
  const v = inp.value.trim();
  if (!v) { toast("O nome não pode ficar vazio.", true); renderClients(); return; }
  content.clients[+inp.dataset.cname].name = v;
  await saveAll("Nome salvo.");
});

/* ---------- Contatos ---------- */
let leads = [], leadFilter = "open", leadPeriod = "all";

const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
/* A data do contato é gravada no horário de Brasília ("2026-09-24T13:42:15-03:00"),
   então os 7 primeiros caracteres já dão ano e mês. */
const leadMonth = (l) => String(l.date).slice(0, 7);
const periodLabel = (p) => p === "all" ? "todos os períodos" : p.length === 4 ? p : MONTHS[+p.slice(5, 7) - 1] + " de " + p.slice(0, 4);
const inPeriod = (l) => leadPeriod === "all" || leadMonth(l).startsWith(leadPeriod);

/* Opções do período: cada ano (inteiro) e os meses que têm contatos, do mais recente ao mais antigo. */
function renderPeriods() {
  const months = [...new Set(leads.map(leadMonth))].sort().reverse();
  const years = [...new Set(months.map((m) => m.slice(0, 4)))];
  if (leadPeriod !== "all" && !months.some((m) => m.startsWith(leadPeriod))) leadPeriod = "all";
  const opt = (v, t) => '<option value="' + v + '"' + (v === leadPeriod ? " selected" : "") + ">" + t + "</option>";
  $("#lead-period").innerHTML = opt("all", "Todos os períodos") + years.map((y) =>
    '<optgroup label="' + y + '">' + opt(y, y + " inteiro") +
    months.filter((m) => m.startsWith(y)).map((m) => opt(m, MONTHS[+m.slice(5, 7) - 1] + " de " + y)).join("") + "</optgroup>").join("");
}

$("#lead-period").addEventListener("change", (e) => { leadPeriod = e.target.value; renderLeads(); });

async function loadLeads() {
  try { leads = (await api("leads", {})).leads || []; } catch (e) { toast(e.message, true); }
  renderLeads();
}

const fmtDate = (iso) => { const d = new Date(iso); return d.toLocaleDateString("pt-BR") + " às " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); };
const waLink = (lead) => {
  let d = String(lead.phone || "").replace(/\D+/g, "");
  if (d.length <= 11) d = "55" + d;
  return "https://wa.me/" + d + "?text=" + encodeURIComponent("Olá, " + lead.name.split(" ")[0] + "! Aqui é da Bow, recebemos seu contato pelo site.");
};

function renderLeads() {
  const open = leads.filter((l) => !l.done).length;
  const badge = $("#lead-count");
  badge.hidden = !open; badge.textContent = open;
  renderPeriods();
  const inP = leads.filter(inPeriod), openInP = inP.filter((l) => !l.done).length;
  const list = leadFilter === "open" ? inP.filter((l) => !l.done) : inP;
  $("#lead-summary").textContent = inP.length + (inP.length === 1 ? " contato" : " contatos") +
    (leadPeriod === "all" ? " no total" : " em " + periodLabel(leadPeriod)) + " · " + openInP + (openInP === 1 ? " não respondido" : " não respondidos");
  $("#lead-csv").href = "api.php?action=leads_csv&period=" + leadPeriod + "&status=" + leadFilter;
  $("#lead-list").innerHTML = list.length ? list.map((l) =>
    '<li class="lead' + (l.done ? " is-done" : "") + '">' +
      '<div class="lead-main"><div class="lead-top"><strong>' + h(l.name) + "</strong>" + (l.company ? '<span class="muted">' + h(l.company) + "</span>" : "") + "</div>" +
      '<div class="lead-meta">' + (l.email ? '<a href="mailto:' + h(l.email) + '">' + h(l.email) + "</a>" : "") + (l.phone ? "<span>" + h(l.phone) + "</span>" : "") + "</div>" +
      '<div class="lead-when muted">' + h(fmtDate(l.date)) + (l.page ? " · " + h(l.page) : "") + "</div></div>" +
      '<div class="lead-actions">' +
        (l.phone ? '<a class="btn btn-green sm" href="' + h(waLink(l)) + '" target="_blank" rel="noopener">WhatsApp</a>' : "") +
        (l.email ? '<a class="btn btn-ghost sm" href="mailto:' + h(l.email) + '">E-mail</a>' : "") +
        '<button class="btn btn-ghost sm" data-done="' + h(l.id) + '">' + (l.done ? "Reabrir" : "Marcar respondido") + "</button>" +
        '<button class="icon-btn" data-ldel="' + h(l.id) + '" title="Apagar">×</button>' +
      "</div></li>").join("")
    : '<li class="empty muted">' + (!leads.length ? "Nenhum contato ainda. Eles aparecem aqui assim que alguém enviar o formulário do site."
      : leadFilter === "open" && inP.length ? "Nenhum contato esperando resposta" + (leadPeriod === "all" ? "." : " em " + periodLabel(leadPeriod) + ".")
      : "Nenhum contato em " + periodLabel(leadPeriod) + ".") + "</li>";
}

$$(".seg-btn").forEach((b) => b.addEventListener("click", () => {
  leadFilter = b.dataset.filter;
  $$(".seg-btn").forEach((x) => x.classList.toggle("is-on", x === b));
  renderLeads();
}));

$("#lead-list").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const id = b.dataset.done || b.dataset.ldel, lead = leads.find((l) => l.id === id);
  if (!lead) return;
  try {
    if (b.dataset.done) {
      await api("lead_update", { id, done: !lead.done });
      lead.done = !lead.done; toast(lead.done ? "Marcado como respondido." : "Contato reaberto.");
    } else {
      if (!confirm('Apagar o contato de "' + lead.name + '"?')) return;
      await api("lead_delete", { id });
      leads = leads.filter((l) => l.id !== id); toast("Contato apagado.");
    }
    renderLeads();
  } catch (ex) { toast(ex.message, true); }
});

/* ---------- Cases ---------- */
function renderCases() {
  const n = content.cases.length;
  $("#case-list").innerHTML = content.cases.map((c, i) =>
    '<li class="case-row">' +
      '<img class="case-thumb" src="' + h(preview(c.imgs && c.imgs[0])) + '" alt="">' +
      '<div class="case-info"><strong>' + h(c.name) + '</strong><span class="muted">' + h([c.segment, c.year].filter(Boolean).join(" · ")) + "</span>" +
        (i < 6 ? '<span class="badge">Na Home</span>' : "") + "</div>" +
      '<div class="case-actions">' +
        '<button class="icon-btn" data-up="' + i + '"' + (i === 0 ? " disabled" : "") + ' title="Subir">↑</button>' +
        '<button class="icon-btn" data-down="' + i + '"' + (i === n - 1 ? " disabled" : "") + ' title="Descer">↓</button>' +
        '<a class="btn btn-ghost sm" href="../#/cases/' + h(c.slug) + '" target="_blank" rel="noopener">Ver</a>' +
        '<button class="btn btn-ghost sm" data-edit="' + i + '">Editar</button>' +
        '<button class="btn btn-danger sm" data-del="' + i + '">Remover</button>' +
      "</div></li>").join("");
}

$("#case-list").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const L = content.cases;
  if (b.dataset.up) { const i = +b.dataset.up; [L[i - 1], L[i]] = [L[i], L[i - 1]]; await saveAll("Ordem salva."); }
  else if (b.dataset.down) { const i = +b.dataset.down; [L[i + 1], L[i]] = [L[i], L[i + 1]]; await saveAll("Ordem salva."); }
  else if (b.dataset.edit) openEditor(+b.dataset.edit);
  else if (b.dataset.del) {
    const i = +b.dataset.del;
    if (L.length === 1) { toast("Deixe pelo menos um case no site.", true); return; }
    if (!confirm('Remover o case "' + L[i].name + '" do site? Isso não pode ser desfeito.')) return;
    const removed = L.splice(i, 1);
    if (!(await saveAll("Case removido."))) L.splice(i, 0, removed[0]);
  }
});

let editing = -1, draftImgs = [], draftVideo = null;
const FIELDS = ["name", "segment", "services", "year", "card", "lead", "challengeH", "challenge", "solutionH", "solution", "resultH"];

function openEditor(i) {
  editing = i;
  const c = i >= 0 ? content.cases[i] : {};
  const f = $("#case-form");
  FIELDS.forEach((k) => { f[k].value = c[k] || ""; });
  f.deliver.value = (c.deliver || []).join("\n");
  draftImgs = (c.imgs || []).slice(0, 4);
  draftVideo = c.video || null;
  $("#editor-title").textContent = i >= 0 ? "Editar case" : "Novo case";
  $("#editor-err").textContent = "";
  renderDraftImgs();
  $("#editor").showModal();
  f.scrollTop = 0;
}

function renderDraftImgs() {
  $("#case-imgs").innerHTML = CASE_IMGS.map((label, k) =>
    '<div class="img-slot"><div class="img-prev">' +
      (draftImgs[k] != null ? '<img src="' + h(preview(draftImgs[k])) + '" alt="">' : '<span class="muted">Sem imagem</span>') +
    '</div><span class="img-label">' + label + '</span><button type="button" class="btn btn-ghost sm" data-img="' + k + '">' + (draftImgs[k] != null ? "Trocar" : "Enviar imagem") + "</button></div>").join("") +
    '<div class="img-slot is-video"><div class="img-prev">' + (draftVideo ? videoTag(draftVideo) : '<span class="muted">Sem vídeo</span>') + "</div>" +
    '<span class="img-label">Vídeo do topo (opcional)</span><span class="hint">Toca no lugar da capa, no topo da página do case. MP4, até 80 MB.</span>' +
    '<div class="row"><button type="button" class="btn btn-ghost sm" data-video>' + (draftVideo ? "Trocar vídeo" : "Enviar vídeo") + "</button>" +
    (draftVideo ? '<button type="button" class="btn btn-link sm" data-video-del>Remover</button>' : "") + "</div></div>";
}

$("#case-imgs").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.img) {
    const path = await pickAndUpload(b, "image");
    if (path) { draftImgs[+b.dataset.img] = path; renderDraftImgs(); }
  } else if (b.hasAttribute("data-video")) {
    const path = await pickAndUpload(b, "video");
    if (path) { draftVideo = path; renderDraftImgs(); }
  } else if (b.hasAttribute("data-video-del")) { draftVideo = null; renderDraftImgs(); }
});

$("#btn-new").addEventListener("click", () => openEditor(-1));
$$("[data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));

$("#case-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = $("#case-form"), err = $("#editor-err");
  err.textContent = "";
  const c = editing >= 0 ? Object.assign({}, content.cases[editing]) : {};
  FIELDS.forEach((k) => { c[k] = f[k].value.trim(); });
  c.deliver = f.deliver.value.split("\n").map((s) => s.trim()).filter(Boolean);
  c.imgs = draftImgs.slice();
  if (draftVideo) c.video = draftVideo; else delete c.video;
  if (!c.name) { err.textContent = "Coloque o nome do cliente."; f.name.focus(); return; }
  if (c.imgs.filter((x) => x != null).length < 4) { err.textContent = "Envie as 4 imagens do case."; return; }
  if (editing < 0) c.slug = "";
  const before = content.cases.slice();
  if (editing >= 0) content.cases[editing] = c; else content.cases.push(c);
  $("#editor-save").disabled = true;
  const ok = await saveAll(editing >= 0 ? "Case salvo." : "Case adicionado ao site.");
  $("#editor-save").disabled = false;
  if (ok) $("#editor").close(); else { content.cases = before; }
});

/* ---------- Imagens do site ---------- */
function renderSlots() {
  const groups = [];
  IMAGE_SLOTS.forEach(([key, group, label, def, type]) => {
    let g = groups.find((x) => x.name === group);
    if (!g) groups.push(g = { name: group, items: [] });
    g.items.push({ key, label, def, type });
  });
  $("#slot-groups").innerHTML = groups.map((g) =>
    '<div class="slot-group"><h3>' + h(g.name) + '</h3><div class="slot-grid">' + g.items.map(({ key, label, def, type }) => {
      const custom = content.images[key] != null, ref = custom ? content.images[key] : def;
      if (type === "video") {
        return '<div class="img-slot is-video"><div class="img-prev">' + (custom ? videoTag(ref) : '<span class="muted">Sem vídeo</span>') + "</div>" +
          '<span class="img-label">' + h(label) + '</span><span class="hint">Toca no lugar da foto. MP4, até 80 MB.</span>' +
          '<div class="row"><button class="btn btn-ghost sm" data-slot="' + h(key) + '" data-kind="video">' + (custom ? "Trocar vídeo" : "Enviar vídeo") + "</button>" +
          (custom ? '<button class="btn btn-link sm" data-reset="' + h(key) + '">Remover</button>' : "") + "</div></div>";
      }
      return '<div class="img-slot"><div class="img-prev"><img src="' + h(preview(ref)) + '" alt="" loading="lazy">' +
        (custom ? '<span class="badge on-img">Sua imagem</span>' : "") + '</div><span class="img-label">' + h(label) + "</span>" +
        '<div class="row"><button class="btn btn-ghost sm" data-slot="' + h(key) + '" data-kind="image">Trocar</button>' +
        (custom ? '<button class="btn btn-link sm" data-reset="' + h(key) + '">Voltar à original</button>' : "") + "</div></div>";
    }).join("") + "</div></div>").join("");
}

$("#slot-groups").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const video = b.dataset.kind === "video" || /Video$/.test(b.dataset.reset || "");
  if (b.dataset.slot) {
    const path = await pickAndUpload(b, b.dataset.kind);
    if (path) { content.images[b.dataset.slot] = path; await saveAll(video ? "Vídeo no ar." : "Imagem trocada."); }
  } else if (b.dataset.reset) {
    delete content.images[b.dataset.reset];
    await saveAll(video ? "Vídeo removido." : "Imagem original restaurada.");
  }
});

/* ---------- Senha ---------- */
$("#btn-pwd").addEventListener("click", () => { $("#pwd-form").reset(); $("#pwd-err").textContent = ""; $("#pwd").showModal(); });
$("#pwd-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  try { await api("password", { current: f.current.value, password: f.password.value }); $("#pwd").close(); toast("Senha alterada."); }
  catch (ex) { $("#pwd-err").textContent = ex.message; }
});

/* ---------- Início ---------- */
(async function init() {
  try {
    const s = await api("status");
    setupMode = s.setup;
    if (s.logged) await openApp(); else showAuth();
  } catch (e) {
    showAuth();
    $("#auth-err").textContent = e.message;
  }
})();
