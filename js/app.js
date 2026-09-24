/* Estado, rotas (#/...), header e formulário. */

const state = { route: { page: "home" }, svc: 2, sent: false };

const TITLES = { home: "Bow — Marca, digital e tecnologia", solucoes: "Soluções — Bow", cases: "Cases — Bow", sobre: "Sobre — Bow" };

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
  closeMenu();
  scrollToTop();
  initPageMotion(first);
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
function closeMenu() { shell().classList.remove("menu-open"); }

function initHeader() {
  const el = shell();
  el.addEventListener("mouseenter", () => el.classList.add("is-hover"));
  el.addEventListener("mouseleave", () => el.classList.remove("is-hover", "menu-open"));
  el.querySelector("[data-menu-trigger]").addEventListener("mouseenter", () => el.classList.add("menu-open"));
  el.querySelectorAll("[data-menu-close]").forEach((b) => b.addEventListener("mouseenter", closeMenu));

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
  document.addEventListener("submit", (e) => {
    const form = e.target.closest("[data-contact-form]");
    if (!form) return;
    e.preventDefault();
    // TODO: ligar a um serviço de envio (Formspree, Web3Forms…). Por ora só confirma na tela, como no protótipo.
    state.sent = true;
    const btn = form.querySelector(".btn-submit");
    if (btn) btn.textContent = "Enviado ✓";
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
