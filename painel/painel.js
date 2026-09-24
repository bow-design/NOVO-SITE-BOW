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
const content = { cases: [], images: {} };

/* Imagem para pré-visualização: número = foto de banco; texto = arquivo enviado. */
const preview = (ref) => ref == null ? "" : typeof ref === "string" ? "../" + ref : px(ref, 600);

/* ---------- API ---------- */
async function api(action, data, form) {
  const opts = { method: data === undefined && !form ? "GET" : "POST", credentials: "same-origin", headers: { "X-CSRF-Token": csrf } };
  if (form) opts.body = form;
  else if (data !== undefined) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(data); }
  let res, j;
  try { res = await fetch("api.php?action=" + action, opts); j = await res.json(); }
  catch (e) { throw new Error("Sem resposta do servidor. O painel precisa de PHP (hospedagem Hostinger)."); }
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

/* Escolhe um arquivo, envia e devolve o caminho salvo (ou null). */
function pickAndUpload(btn) {
  return new Promise((resolve) => {
    const input = $("#file");
    input.value = "";
    input.onchange = async () => {
      const f = input.files[0];
      if (!f) return resolve(null);
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = "Enviando…";
      try {
        const fd = new FormData(); fd.append("file", f);
        const j = await api("upload", undefined, fd);
        resolve(j.path);
      } catch (e) { toast(e.message, true); resolve(null); }
      finally { btn.disabled = false; btn.textContent = label; }
    };
    input.click();
  });
}

async function saveAll(msg) {
  try {
    const j = await api("save", { content });
    content.cases = j.content.cases; content.images = asObj(j.content.images);
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
  $("#auth").hidden = true; $("#app").hidden = false;
  render();
}

$("#btn-logout").addEventListener("click", async () => { try { await api("logout", {}); } catch (e) {} location.reload(); });

/* ---------- Abas ---------- */
$$(".tab").forEach((t) => t.addEventListener("click", () => {
  $$(".tab").forEach((x) => x.classList.toggle("is-on", x === t));
  $$("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== t.dataset.tab; });
}));

function render() { renderCases(); renderSlots(); }

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

let editing = -1, draftImgs = [];
const FIELDS = ["name", "segment", "services", "year", "card", "lead", "challengeH", "challenge", "solutionH", "solution", "resultH"];

function openEditor(i) {
  editing = i;
  const c = i >= 0 ? content.cases[i] : {};
  const f = $("#case-form");
  FIELDS.forEach((k) => { f[k].value = c[k] || ""; });
  f.deliver.value = (c.deliver || []).join("\n");
  draftImgs = (c.imgs || []).slice(0, 4);
  $("#editor-title").textContent = i >= 0 ? "Editar case" : "Novo case";
  $("#editor-err").textContent = "";
  renderDraftImgs();
  $("#editor").showModal();
  f.scrollTop = 0;
}

function renderDraftImgs() {
  $("#case-imgs").innerHTML = CASE_IMGS.map((label, k) =>
    '<div class="img-slot"><div class="img-prev' + (k === 0 ? " wide" : "") + '">' +
      (draftImgs[k] != null ? '<img src="' + h(preview(draftImgs[k])) + '" alt="">' : '<span class="muted">Sem imagem</span>') +
    '</div><span class="img-label">' + label + '</span><button type="button" class="btn btn-ghost sm" data-img="' + k + '">' + (draftImgs[k] != null ? "Trocar" : "Enviar imagem") + "</button></div>").join("");
}

$("#case-imgs").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-img]");
  if (!b) return;
  const path = await pickAndUpload(b);
  if (path) { draftImgs[+b.dataset.img] = path; renderDraftImgs(); }
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
  IMAGE_SLOTS.forEach(([key, group, label, def]) => {
    let g = groups.find((x) => x.name === group);
    if (!g) groups.push(g = { name: group, items: [] });
    g.items.push({ key, label, def });
  });
  $("#slot-groups").innerHTML = groups.map((g) =>
    '<div class="slot-group"><h3>' + h(g.name) + '</h3><div class="slot-grid">' + g.items.map(({ key, label, def }) => {
      const custom = content.images[key] != null;
      return '<div class="img-slot"><div class="img-prev"><img src="' + h(preview(custom ? content.images[key] : def)) + '" alt="" loading="lazy">' +
        (custom ? '<span class="badge on-img">Sua imagem</span>' : "") + '</div><span class="img-label">' + h(label) + "</span>" +
        '<div class="row"><button class="btn btn-ghost sm" data-slot="' + h(key) + '">Trocar</button>' +
        (custom ? '<button class="btn btn-link sm" data-reset="' + h(key) + '">Voltar à original</button>' : "") + "</div></div>";
    }).join("") + "</div></div>").join("");
}

$("#slot-groups").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.slot) {
    const path = await pickAndUpload(b);
    if (path) { content.images[b.dataset.slot] = path; await saveAll("Imagem trocada."); }
  } else if (b.dataset.reset) {
    delete content.images[b.dataset.reset];
    await saveAll("Imagem original restaurada.");
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
