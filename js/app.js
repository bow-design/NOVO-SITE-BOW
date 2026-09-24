/* Estado, rotas (#/...), header e formulário. */

const state = { route: { page: "home" }, svc: 2 };

const TITLES = { home: "Bow — Sua empresa merece ser escolhida", solucoes: "Soluções — Bow", cases: "Cases — Bow", sobre: "Sobre — Bow" };

/* #/  #/solucoes  #/solucoes/:slug  #/cases  #/cases/:slug  #/sobre */
function parseRoute(hash) {
  const parts = (hash || "").replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "solucoes") {
    if (!parts[1]) return { page: "solucoes" };
    const i = SVC_PAGES.findIndex((s) => s.slug === parts[1]);
    if (i >= 0) return { page: "servico", i };
  }
  if (parts[0] === "cases") {
    if (!parts[1]) return { page: "cases" };
    const i = CASES.findIndex((c) => c.slug === parts[1]);
    if (i >= 0) return { page: "case", i };
  }
  if (parts[0] === "sobre") return { page: "sobre" };
  return { page: "home" };
}

const routeKey = (r) => r.page + ":" + (r.i != null ? r.i : "");

function renderPage(route) {
  switch (route.page) {
    case "solucoes": return pageSolucoes();
    case "servico": return pageServico(route.i);
    case "cases": return pageCases();
    case "case": return pageCase(route.i);
    case "sobre": return pageSobre();
    default: return pageHome();
  }
}

function pageTitle(route) {
  if (route.page === "servico") return SVC_PAGES[route.i].title + " — Bow";
  if (route.page === "case") return CASES[route.i].name + " — Bow";
  return TITLES[route.page];
}

function mount(route, first) {
  killPageMotion();
  state.route = route;
  const old = document.querySelector("#root main");
  old.insertAdjacentHTML("beforebegin", renderPage(route));
  old.remove();
  document.title = pageTitle(route);
  // O botão flutuante do WhatsApp sai de cena enquanto o formulário de contato está na tela.
  watchContactForFloat();
  // Hora em que o formulário apareceu: envios em menos de 2,5 s são tratados como robô.
  document.querySelectorAll("[data-contact-form]").forEach((f) => { f.dataset.t = Date.now(); });
  closeMenu();
  scrollToTop();
  initPageMotion(first);
}

let floatIO = null;
function watchContactForFloat() {
  const btn = document.querySelector(".wa-float"), sec = document.getElementById("contato");
  if (floatIO) floatIO.disconnect();
  btn.classList.remove("is-away");
  if (!sec || !window.IntersectionObserver) return;
  floatIO = new IntersectionObserver(([e]) => btn.classList.toggle("is-away", e.isIntersecting), { rootMargin: "0px 0px -15% 0px" });
  floatIO.observe(sec);
}

let navigating = false;
function go(route) {
  if (routeKey(route) === routeKey(state.route)) { scrollToTop(); return; }
  const main = document.querySelector("#root main");
  if (navigating) return;
  navigating = true;
  let done = false;
  const fire = () => { if (done) return; done = true; navigating = false; mount(parseRoute(location.hash), false); };
  gsap.to(main, { opacity: 0, y: -12, duration: .28, ease: "power2.in", onComplete: fire });
  setTimeout(fire, 360);
}

/* ---------- Header: transparente; branco no hover; "Soluções" abre o menu ---------- */
const shell = () => document.querySelector("[data-intro-nav]");
function closeMenu() { shell().classList.remove("menu-open"); setMobileMenu(false); }

/* Menu do celular (☰): tela cheia, trava o scroll da página enquanto aberto. */
function setMobileMenu(open) {
  const el = shell(), btn = el.querySelector("[data-burger]");
  el.classList.toggle("mnav-open", open);
  document.documentElement.classList.toggle("no-scroll", open);
  btn.setAttribute("aria-expanded", String(open));
  btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  if (lenis) open ? lenis.stop() : lenis.start();
}

function initHeader() {
  const el = shell();
  // Hover (header branco + menu Soluções) só onde existe mouse.
  if (window.matchMedia("(hover: hover)").matches) {
    el.addEventListener("mouseenter", () => el.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => el.classList.remove("is-hover", "menu-open"));
    el.querySelector("[data-menu-trigger]").addEventListener("mouseenter", () => el.classList.add("menu-open"));
    el.querySelectorAll("[data-menu-close]").forEach((b) => b.addEventListener("mouseenter", () => el.classList.remove("menu-open")));
  }
  el.querySelector("[data-burger]").addEventListener("click", () => setMobileMenu(!el.classList.contains("mnav-open")));
  el.querySelector("[data-mnav-svc]").innerHTML = SVC_PAGES.map((s, i) =>
    '<a href="#/solucoes/' + s.slug + '"><span>' + pad(i + 1) + "</span>" + esc(s.title) + "</a>").join("");
  el.querySelectorAll(".mnav a").forEach((a) => a.addEventListener("click", () => setMobileMenu(false)));
  el.querySelectorAll("[data-wa]").forEach((a) => { a.href = CONTACT[a.dataset.wa]; });
  // No celular o header ganha fundo escuro depois que a página rola.
  const solid = () => el.classList.toggle("is-solid", window.scrollY > 24);
  window.addEventListener("scroll", solid, { passive: true });
  solid();

  el.querySelector("[data-mega]").innerHTML = SVC_PAGES.map((s, i) =>
    '<a class="mega-item" href="#/solucoes/' + s.slug + '"><span class="mega-icon">' + MENU_ICONS[i] + "</span>" +
    '<span><span class="mega-title">' + esc(s.title) + '</span><span class="mega-short">' + esc(SERVICES[i].desc.split(".")[0] + ".") + "</span></span></a>").join("");
}

function initFooter() {
  const f = document.querySelector(".site-footer");
  f.querySelector("[data-foot-svc]").innerHTML = SVC_PAGES.map((s) =>
    '<a class="flink" href="#/solucoes/' + s.slug + '">' + esc(s.title) + "</a>" +
    (s.slug === "saas-tecnologia" ? '<a class="flink" href="#/solucoes/saas-tecnologia">Sistemas</a>' : "")).join("");
  f.querySelectorAll("[data-wa]").forEach((a) => { a.href = CONTACT[a.dataset.wa]; });
  document.querySelectorAll(".wa-float[data-wa]").forEach((a) => { a.href = CONTACT[a.dataset.wa]; });
  f.querySelector("[data-year]").textContent = "© " + new Date().getFullYear() + " Bow Agência. Todos os direitos reservados.";
}

/* ---------- Links internos e formulário ---------- */
function initLinks() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (!a) return;
    const href = a.getAttribute("href");
    if (href.startsWith("#/")) {
      // Mesma rota: só volta ao topo.
      if (routeKey(parseRoute(href)) === routeKey(state.route)) { e.preventDefault(); scrollToTop(); }
      return;
    }
    // Âncoras simples (#contato) rolam suavemente sem trocar a rota.
    e.preventDefault();
    scrollToEl(document.getElementById(href.slice(1)));
  });
  // Formulário de contato: salva no painel (aba Contatos) e avisa por e-mail.
  document.addEventListener("submit", async (e) => {
    const form = e.target.closest("[data-contact-form]");
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector(".btn-submit"), status = form.querySelector(".form-status");
    const v = (n) => form.elements[n].value.trim();
    const data = { name: v("name"), company: v("company"), email: v("email"), phone: v("phone"), website: v("website"),
      page: document.title, elapsed: Date.now() - (+form.dataset.t || 0) };
    const say = (msg, bad) => { status.innerHTML = msg; status.classList.toggle("is-error", !!bad); };
    if (!data.email && !data.phone) { say("Deixe um e-mail ou WhatsApp para a gente responder.", true); return; }
    btn.disabled = true; btn.textContent = "Enviando…"; say("");
    try {
      const res = await fetch("api/contact.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await res.json().catch(() => null);
      if (!res.ok || !j || !j.ok) throw new Error((j && j.error) || "");
      form.reset();
      btn.textContent = "Enviado ✓";
      say("Recebemos seu contato. Retornamos em até um dia útil.");
      setTimeout(() => { btn.disabled = false; btn.textContent = "Enviar"; }, 6000);
    } catch (err) {
      btn.disabled = false; btn.textContent = "Enviar";
      // Sem servidor (ou erro inesperado): oferece o WhatsApp com os dados já escritos.
      const msg = "Olá! Vim pelo site da Bow.\nNome: " + data.name + (data.company ? "\nEmpresa: " + data.company : "") +
        (data.email ? "\nE-mail: " + data.email : "") + (data.phone ? "\nWhatsApp: " + data.phone : "");
      say((err.message ? esc(err.message) + " " : "Não conseguimos enviar agora. ") +
        '<a href="' + esc(wa(msg)) + '" target="_blank" rel="noopener">Enviar pelo WhatsApp →</a>', true);
    }
  });
}

/* Conteúdo salvo pelo painel. Sem PHP (GitHub Pages, arquivo local) ou em caso
   de erro, o site segue com os padrões de data.js. */
async function loadContent() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch("api/content.php", { cache: "no-store", signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) applyContent(await res.json());
  } catch (e) { /* usa os padrões */ }
}

async function boot() {
  await loadContent();
  initHeader();
  initFooter();
  initLinks();
  initGlobalMotion();
  const route = location.hash.startsWith("#/") ? parseRoute(location.hash) : { page: "home" };
  mount(route, true);
  window.addEventListener("hashchange", () => {
    if (!location.hash.startsWith("#/") && location.hash !== "") return;
    go(parseRoute(location.hash));
  });
}

boot();
