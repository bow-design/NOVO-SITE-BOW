/* Templates das páginas. Cada função devolve o HTML do <main> da rota.
   Os atributos data-* são os ganchos das animações em motion.js. */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pad = (n, w) => String(n).padStart(w || 2, "0");
const bgUrl = (ref, w) => "background-image:url(&quot;" + esc(px(ref, w)) + "&quot;)";

const grain = (id, opts) => {
  const o = opts || {};
  return '<svg class="grain"' + (o.svgOpacity != null ? ' style="opacity:' + o.svgOpacity + '"' : "") + '><filter id="' + id + '"><feTurbulence type="fractalNoise" baseFrequency="' + (o.freq || ".85") + '" numOctaves="3" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter><rect width="100%" height="100%" filter="url(#' + id + ')"' + (o.rectOpacity != null ? ' opacity="' + o.rectOpacity + '"' : "") + "></rect></svg>";
};

/* Mídia de fundo do topo: vídeo (com a foto como imagem de espera) ou só a foto.
   Com "economia de dados" ligada no celular, fica só a foto. */
const saveData = () => !!(navigator.connection && navigator.connection.saveData);
function heroMedia(img, video, w) {
  const poster = img != null ? esc(px(img, w)) : "";
  if (video && !saveData()) {
    return '<video class="cover" src="' + esc(video) + '"' + (poster ? ' poster="' + poster + '"' : "") +
      ' autoplay muted loop playsinline preload="auto" aria-hidden="true"></video>';
  }
  return poster ? '<img class="cover" src="' + poster + '" alt="" decoding="async">' : "";
}

const ARROW_UR = (size, stroke) => '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="#111" stroke-width="' + (stroke || 2) + '" stroke-linecap="round"><path d="M7 17L17 7M9 7h8v8"></path></svg>';

/* ---------- Partes compartilhadas ---------- */

function marquee(clients, cls) {
  if (!clients.length) return "";
  const group = '<div class="mgroup">' + clients.map((c) => c.logo
    ? '<img class="mlogo" src="' + esc(px(c.logo)) + '" alt="' + esc(c.name) + '" decoding="async">'
    : "<span>" + esc(c.name.toUpperCase()) + "</span>").join("") + "</div>";
  return '<div class="' + cls + '"><div class="mtrack" data-mtrack>' + group + group + "</div></div>";
}

function workCard(c, i, prefix) {
  return '<a class="work" href="#/cases/' + c.slug + '" data-work data-fade>' +
    '<img data-work-img class="cover" src="' + esc(px(c.imgs[0], 1100)) + '" alt="' + esc(c.name) + '" decoding="async">' +
    '<div class="work-shade"></div>' +
    '<div class="work-ov" data-work-ov><div class="abs-fill" style="background:' + WORK_GRADS[i % WORK_GRADS.length] + '"></div>' + grain(prefix + i, { rectOpacity: ".7" }) +
    '<span class="work-go">' + ARROW_UR(16) + "</span></div>" +
    '<div class="work-name">' + esc(c.name) + "</div>" +
    '<p class="work-desc">' + esc(c.card) + "</p></a>";
}

function workGrid(prefix, limit, cls) {
  return '<div class="work-grid' + (cls ? " " + cls : "") + '">' + CASES.slice(0, limit || CASES.length).map((c, i) => workCard(c, i, prefix)).join("") + "</div>";
}

function contactSection(lowercase) {
  const title = lowercase
    ? '<h2 data-reveal class="lc">Tem um projeto em mente? Vamos conversar<span class="dot">.</span></h2>'
    : "<h2 data-reveal>Tem um projeto em mente? Vamos conversar.</h2>";
  const field = (label, type, name, extra) => '<label class="field" data-ci><span>' + label + '</span><input type="' + type + '" name="' + name + '"' + (extra || "") + "></label>";
  return '<section id="contato" class="contact">' + grain("bowcgrain", { freq: ".8", rectOpacity: ".6" }) +
    '<div class="contact-grid"><div class="contact-copy">' + title +
    '<p data-ci>Conte para a gente o que você está construindo. A gente começa pela conversa e aponta o melhor caminho para o seu projeto.</p></div>' +
    '<form class="contact-form" data-ci-card data-contact-form>' +
    '<div data-ci><h3>Fale com a Bow</h3><p class="form-sub">Preencha e retornamos em até um dia útil.</p></div>' +
    '<div class="fields">' + field("Nome", "text", "name", ' autocomplete="name" maxlength="80" required') + field("Empresa", "text", "company", ' autocomplete="organization" maxlength="120"') +
      field("E-mail", "email", "email", ' autocomplete="email" maxlength="120"') + field("WhatsApp", "tel", "phone", ' autocomplete="tel" inputmode="tel" maxlength="30" placeholder="(51) 99999-9999"') + "</div>" +
    // Campo invisível: só robôs preenchem.
    '<label class="hp" aria-hidden="true">Site<input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
    '<button type="submit" class="btn-submit" data-ci data-magnetic>Enviar</button>' +
    '<p class="form-status" role="status" aria-live="polite"></p>' +
    "</form></div></section>";
}

/* ---------- Home ---------- */

function pageHome() {
  const steps = METHOD.map(([n, t, d]) =>
    '<div class="path-row" data-row><div class="step" data-fade><span class="step-n">' + n + "</span><h3>" + t + "</h3><p>" + d + "</p></div></div>").join("");
  const nodes = METHOD.map(() => '<span class="path-node" data-node></span>').join("");

  const cards = SERVICES.map((s, i) =>
    '<div class="car-card" data-card="' + i + '">' +
    '<div class="car-face" data-face style="background:' + SVC_GRADS[i] + '"></div>' +
    '<svg data-face class="grain" style="opacity:0"><filter id="bowgrain' + i + '"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter><rect width="100%" height="100%" filter="url(#bowgrain' + i + ')" opacity=".75"></rect></svg>' +
    '<svg data-ink class="car-icon" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#6b6b6b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + SVC_ICONS[i] + '"></path></svg>' +
    '<span data-ink class="car-title">' + esc(s.title) + "</span></div>").join("");

  const tick = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#031a03" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-auto-tick><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
  const autoSteps = ["Pedido criado", "Em produção", "Produzido", "Entregue"].map((t, i) =>
    '<div class="auto-step" data-auto-step><span class="auto-step-top"><span class="auto-check" data-auto-check>' + tick + '</span><span class="auto-n">' + pad(i + 1) + '</span></span><span class="auto-label">' + t + "</span></div>").join("");
  const bars = [38, 52, 46, 68, 60, 84, 92].map((h) => '<span style="height:' + h + '%"></span>').join("");
  const wins = ["Estoque", "Pedidos", "Financeiro"].map((t, i) =>
    '<div class="win" data-win="' + i + '" style="top:' + i * 18 + 'px"><div class="win-bar"><i></i><i></i><i></i><span>' + t + '</span></div>' +
    '<div class="win-body"><i style="width:70%"></i><i style="width:52%"></i><i style="width:84%' + (i === 2 ? ";background:rgba(6,224,6,.5)" : "") + '"></i></div></div>').join("");
  const svc = SERVICES[state.svc];

  return '<main>' +
  '<section class="home-hero">' +
    '<div class="abs-fill" style="z-index:0;overflow:hidden"><div class="abs-fill" data-mouse-par><div class="abs-fill" data-hero-bg><div class="ken">' +
      heroMedia(slot("home.hero"), slot("home.heroVideo")) + '</div></div></div></div>' +
    '<div class="shade"></div>' +
    '<div class="home-hero-content">' +
      '<span class="hero-tag" data-intro>Bow / Digital Studio</span>' +
      // A palavra verde troca sozinha (motion.js → initRotator) e segura mais tempo na última.
      '<h1 data-intro-h>Soluções que fazem sua empresa <span class="rot-line"><span class="rotator" data-rotator data-words="aparecer,vender,funcionar,crescer"><span class="rw dot">aparecer</span></span><span class="dot">.</span></span></h1>' +
      '<p class="hero-sub" data-intro>Do marketing aos sistemas sob medida, a Bow cria as soluções que a sua empresa precisa para ir mais longe.</p>' +
      '<a class="hero-link" data-intro href="#contato" data-scroll-to="contato">Começar um projeto <span class="dot arrow">→</span></a>' +
    "</div></section>" +

  marquee(CLIENTS, "marquee") +

  '<section class="method" data-bg-a>' +
    '<div class="method-head"><span class="pill pill--dark" data-fade data-tag>Nosso método</span>' +
      '<h2 data-reveal class="lc">Conectamos estratégia, criação e tecnologia para que cada projeto avance mais forte que o anterior<span class="dot">.</span></h2>' +
      '<p data-fade>Um processo claro, do primeiro diagnóstico à evolução contínua, para você saber exatamente o que está sendo feito e por quê.</p></div>' +
    '<div class="path-wrap" data-path-wrap>' +
      '<svg class="path-svg" fill="none"><path data-path-base stroke="rgba(255,255,255,.14)" stroke-width="1"></path><path data-path stroke="#06e006" stroke-width="2" stroke-linecap="round"></path></svg>' +
      nodes + '<img class="path-drop" data-path-drop src="assets/mark-bow.png" alt="">' +
      '<div style="position:relative">' + steps + "</div>" +
    "</div></section>" +

  '<section class="services light" data-bg-b><div class="services-inner">' +
    '<div class="services-head"><span class="pill pill--light" data-fade data-tag>O que fazemos</span>' +
      '<h2 data-reveal class="lc">Cinco frentes, uma só direção<span class="dot">.</span></h2></div>' +
    '<div class="car" data-car>' + cards + '<span class="car-cursor" data-car-cursor>ARRASTE</span></div>' +
    '<div class="svc-active"><h3 data-svc-title>' + esc(svc.title) + "</h3><p data-svc-desc>" + esc(svc.desc) + "</p></div>" +
  "</div></section>" +

  '<section class="tech light"><div class="wrap">' +
    '<div class="tech-head"><div data-fade><span class="pill pill--solid" data-tag>Tecnologia</span>' +
      '<h2 data-reveal class="lc">Tecnologia sob medida para transformar processos em resultado<span class="dot">.</span></h2></div>' +
      '<div class="tech-side" data-fade><p>Quando uma ideia precisa virar produto, sistema ou operação, a Bow entra no desenvolvimento. Do conceito à interface, da interface ao funcionamento.</p>' +
      '<a class="btn-green btn-lg" href="' + CONTACT.waTech + '" target="_blank" rel="noopener" data-magnetic>Criar uma solução</a></div></div>' +
    '<div class="tech-grid">' +
      '<div class="tblock tblock--auto" data-fade><div class="tblock-head"><span class="tblock-n">01</span><h3>automações<span class="dot">.</span></h3><p>Os processos da sua empresa rodando sozinhos, do pedido à entrega, sem retrabalho.</p></div>' +
        '<div class="auto-steps" data-auto>' + autoSteps + "</div></div>" +
      '<div class="tblock tblock--dash" data-fade>' + grain("bowtgrain", { svgOpacity: ".6" }) +
        '<div class="tblock-head"><span class="tblock-n">02</span><h3>dashboards<span style="color:#fff">.</span></h3><p>Indicadores do seu negócio reunidos em um só painel, em tempo real.</p></div>' +
        '<div class="bars" data-bars>' + bars + "</div></div>" +
      '<div class="tblock tblock--sys" data-sys data-fade><div class="tblock-head"><span class="tblock-n">03</span><h3>sistemas<span class="dot">.</span></h3><p>Sistemas sob medida para a sua empresa, feitos para a sua operação. Do conceito à interface, da interface ao funcionamento.</p></div>' +
        '<div class="wins">' + wins + "</div></div>" +
    "</div></div></section>" +

  '<section class="works light"><div class="wrap">' +
    '<div class="works-head"><div><span class="pill pill--light" data-fade data-tag>Trabalhos</span>' +
      '<h2 data-reveal class="lc">Trabalhos que falam<span class="dot">.</span></h2></div>' +
      '<a class="btn-ghost-dark" href="#/cases" data-fade>Ver todos</a></div>' +
    workGrid("bowwg", 6, "work-grid--swipe") +
  "</div></section>" +

  contactSection(true) +
  "</main>";
}

/* ---------- Soluções ---------- */

function pageSolucoes() {
  const rows = SVC_PAGES.map((s, i) =>
    '<a class="sol-row" href="#/solucoes/' + s.slug + '" data-fade><span class="sol-num">' + pad(i + 1) + "</span>" +
    "<div><h2 data-reveal>" + esc(s.title) + '</h2><p class="sol-desc">' + esc(s.listDesc) + '</p><p class="sol-tags">' +
    s.tags.join(" · ").replace("Landing pages", "Landing Pages") + "</p></div>" +
    '<span class="sol-more">Ver solução <span class="arrow">→</span></span></a>').join("");

  return '<main>' +
  '<section class="sol-hero"><div class="wrap">' +
    '<span class="pill pill--dark" data-fade data-tag>Soluções</span>' +
    "<h1 data-split>Cinco frentes que fazem sua marca avançar.</h1>" +
    "<p data-fade>Da primeira ideia ao projeto no ar, reunimos diferentes disciplinas para construir uma presença digital consistente.</p>" +
  "</div></section>" +
  '<section class="sol-list-sec"><div class="sol-list">' + rows + "</div></section>" +
  '<section class="sol-saas light"><div class="sol-saas-grid">' +
    '<div data-fade><span class="pill pill--light" data-tag>SaaS &amp; Tecnologia</span><h2 data-reveal>Do conceito à interface. Da ideia ao funcionamento.</h2></div>' +
    '<div class="sol-saas-side" data-fade><p>Quando uma ideia precisa virar produto, sistema ou operação, a Bow entra no desenvolvimento — sites, dashboards, automações e integrações.</p>' +
    '<a class="btn-black" href="' + CONTACT.waTech + '" target="_blank" rel="noopener">Criar uma solução</a></div>' +
  "</div></section>" +
  contactSection(false) +
  "</main>";
}

/* ---------- Cases ---------- */

function pageCases() {
  return '<main>' +
  '<section class="cases-hero"><div class="cases-hero-bg">' +
    '<div class="cases-bow">bow.</div><div class="blob blob-a"></div><div class="blob blob-b"></div>' +
    heroMedia(null, slot("cases.heroVideo")) +
    grain("bowchgrain", { freq: ".8", svgOpacity: ".55" }) + '<div class="cases-vignette"></div></div>' +
    '<div class="cases-hero-content">' +
      "<h1 data-split>Marcas que transformam presença em resultado.</h1>" +
      "<p data-fade>Projetos que nasceram de desafios reais e ganharam forma através de estratégia, criatividade e tecnologia.</p>" +
      '<a class="btn-green btn-lg" data-fade href="' + CONTACT.waHref + '" target="_blank" rel="noopener" data-magnetic>Começar um projeto</a>' +
    "</div>" +
    marquee(CLIENTS, "cases-marquee") +
  "</section>" +
  '<section class="cases-grid-sec"><div class="wrap">' + workGrid("bowcwg") + "</div></section>" +
  contactSection(false) +
  "</main>";
}

/* ---------- Case (detalhe) ---------- */

function pageCase(i) {
  const c = CASES[i], nx = (i + 1) % CASES.length, next = CASES[nx];
  const meta = [["Cliente", c.name], ["Segmento", c.segment], ["Serviços", c.services], ["Ano", c.year]].map(([k, v]) =>
    '<div><span class="meta-k" data-tag>' + k + '</span><span class="meta-v">' + esc(v) + "</span></div>").join("");
  const deliver = (c.deliver || []).map((t, k) => '<div class="deliver-row" data-fade><span class="n">' + pad(k + 1) + '</span><span class="t">' + esc(t) + "</span></div>").join("");

  return '<main>' +
  '<section class="detail-hero case-hero">' +
    '<div class="hero-media"><div class="abs-fill" data-mouse-par><div class="abs-fill" data-hero-bg><div class="bg-cover">' + heroMedia(c.imgs[0], c.video) + '</div></div></div></div>' +
    '<div class="case-hero-shade"></div>' +
    '<div class="detail-hero-content">' +
      '<div class="crumbs" data-intro><a class="crumb-back" href="#/cases">← Cases</a><span class="crumb-count">' + pad(i + 1) + " / " + pad(CASES.length) + "</span></div>" +
      "<h1>" + esc(c.name) + '<span class="dot">.</span></h1>' +
      '<p class="lead">' + esc(c.lead) + "</p>" +
      '<div class="meta-grid" data-intro>' + meta + "</div>" +
    "</div></section>" +
  '<section class="two-col light"><div class="two-col-grid">' +
    '<div class="col-block"><span class="kicker kicker--ondark-light" data-tag>O desafio</span><h2 class="h-detail" data-reveal>' + esc(c.challengeH) + "</h2><p>" + esc(c.challenge) + "</p></div>" +
    '<div class="col-block"><span class="kicker kicker--ondark-light" data-tag>A solução</span><h2 class="h-detail" data-reveal>' + esc(c.solutionH) + "</h2><p>" + esc(c.solution) + "</p></div>" +
  "</div></section>" +
  '<section class="gallery"><div class="gallery-inner">' +
    '<div class="g-wide" data-scrub-scale><div class="bg-cover" style="background-color:transparent;' + bgUrl(c.imgs[1]) + '"></div></div>' +
    '<div class="g-pair"><div class="g-tall" data-fade><div class="bg-cover" style="background-color:transparent;' + bgUrl(c.imgs[2]) + '"></div></div>' +
    '<div class="g-tall offset" data-fade><div class="bg-cover" style="background-color:transparent;' + bgUrl(c.imgs[3]) + '"></div></div></div>' +
  "</div></section>" +
  '<section class="deliver"><div class="deliver-grid">' +
    '<div class="col-block"><span class="kicker" data-tag>O que entregamos</span><h2 class="h-detail" data-reveal style="color:#fff">' + esc(c.resultH) + "</h2></div>" +
    '<div style="display:flex;flex-direction:column">' + deliver + "</div>" +
  "</div></section>" +
  '<section class="next-sec"><a class="next-case" href="#/cases/' + next.slug + '">' +
    '<div class="bg-cover" style="background-color:transparent;' + bgUrl(next.imgs[0]) + '"></div><div class="next-shade"></div>' +
    '<div class="next-body"><div class="next-label"><span class="label-up" style="color:rgba(255,255,255,.55)" data-tag>Próximo case</span><span class="next-name">' + esc(next.name) + "</span></div>" +
    '<span class="next-go">' + ARROW_UR(18) + "</span></div></a></section>" +
  contactSection(false) +
  "</main>";
}

/* ---------- Solução (detalhe) ---------- */

function pageServico(i) {
  const s = SVC_PAGES[i];
  const items = s.items.map(([t, d], k) => '<div class="inc-row" data-fade><span class="n">' + pad(k + 1) + "</span><div><h3>" + esc(t) + "</h3><p>" + esc(d) + "</p></div></div>").join("");
  const steps = s.steps.map(([t, d], k) => '<div class="how-step" data-fade><span class="how-n">' + pad(k + 1, 3) + "</span><h3>" + esc(t) + "</h3><p>" + esc(d) + "</p></div>").join("");
  const others = SVC_PAGES.map((o, k) => k === i ? "" :
    '<a class="other" href="#/solucoes/' + o.slug + '"><span class="o-l"><span class="o-n">' + pad(k + 1) + '</span><span class="o-t">' + esc(o.title) + '</span></span><span class="o-a">→</span></a>').join("");

  return '<main>' +
  '<section class="detail-hero svc-hero">' +
    '<div class="hero-media"><div class="abs-fill" data-mouse-par><div class="abs-fill" data-hero-bg><div class="bg-cover">' + heroMedia(slot("sol." + s.slug + ".hero"), slot("sol." + s.slug + ".heroVideo")) + '</div></div></div></div>' +
    '<div class="svc-hero-shade"></div>' +
    '<div class="detail-hero-content">' +
      '<div class="crumbs" data-intro><span class="kicker">Soluções</span><span class="crumb-count">' + pad(i + 1) + " / " + pad(SVC_PAGES.length) + "</span></div>" +
      '<p class="svc-title" data-intro>' + esc(s.title) + "</p>" +
      "<h1>" + esc(s.headline) + "</h1>" +
      '<p class="svc-intro">' + esc(s.intro) + "</p>" +
      '<div class="svc-ctas" data-intro><a class="btn-green" href="' + wa("Olá! Quero saber mais sobre " + s.title + " com a Bow.") + '" target="_blank" rel="noopener" data-magnetic>Quero começar <span class="arrow">→</span></a>' +
        '<a class="btn-ghost-light" href="#/cases">Ver cases</a></div>' +
      '<div class="svc-tags" data-intro>' + s.tags.map((t) => "<span>" + esc(t) + "</span>").join("") + "</div>" +
    "</div></section>" +
  '<section class="two-col light"><div class="wrap-wide">' +
    '<div class="inc-head"><div><span class="kicker kicker--ondark-light" data-tag>O que entregamos</span><h2 class="h-sec" data-reveal>O que está incluído.</h2></div><p>' + esc(s.deliverIntro) + "</p></div>" +
    '<div class="inc-grid">' + items + "</div>" +
  "</div></section>" +
  '<section class="how"><div class="wrap-wide">' +
    '<div class="how-head"><span class="kicker" data-tag>Como funciona</span><h2 class="h-sec" data-reveal style="color:#fff">Do primeiro passo ao resultado.</h2></div>' +
    '<div class="how-grid">' + steps + "</div>" +
  "</div></section>" +
  '<section class="statement-sec"><div class="statement" data-scrub-scale>' +
    '<div class="bg-cover" style="' + bgUrl(slot("sol." + s.slug + ".statement")) + '"></div><div class="st-shade"></div><p>' + esc(s.statement) + "</p></div></section>" +
  '<section class="others"><div class="wrap-wide">' +
    '<div style="margin-bottom:clamp(28px,3vw,44px)"><span class="kicker" data-tag>Outras soluções</span></div>' +
    '<div class="others-list">' + others + "</div>" +
  "</div></section>" +
  contactSection(false) +
  "</main>";
}

/* ---------- Sobre ---------- */

function pageSobre() {
  const lines = (arr, attr) => arr.map((l) => '<span class="mline"><span ' + attr + ">" + l + "</span></span>").join(" ");
  const uni = UNIVERSE.map(([, label, sp, clip, pos, ratio], i) =>
    '<div class="uni" data-sb-par="' + sp + '" style="' + pos + '"><div class="uni-img"' + (clip ? " data-sb-clip" : "") + ' style="aspect-ratio:' + ratio + '">' +
    '<img class="cover" src="' + esc(px(slot("sobre.uni." + i), 1200)) + '" alt="' + label + '" decoding="async"></div><span class="uni-label" data-tag>' + label + "</span></div>").join("");
  const prins = PRINCIPLES.map(([n, t, d], i) =>
    '<div class="prin" data-prin="' + i + '"><span class="prin-n">' + n + '</span><div class="prin-body"><div class="prin-title"><span class="prin-dash"></span><h3>' + t + "</h3></div><p>" + d + "</p></div></div>").join("");
  const pimgs = PRINCIPLES.map((_, i) => '<div class="pimg' + (i === 0 ? " is-on" : "") + '" data-pimg="' + i + '"><div class="bg-cover" style="' + bgUrl(slot("sobre.prin." + i), 900) + '"></div></div>').join("");

  return '<main>' +
  '<section class="sb-hero"><div class="cols"></div>' +
    '<div class="sb-row sb-top"><span class="kicker kicker--45" data-sb-stag>Sobre a Bow</span><span class="label-up" data-sb-stag>Design · Estratégia · Tecnologia</span></div>' +
    '<div class="sb-row sb-mid"><h1>' + lines(["Não somos só", "uma agência. Somos", "parte do que faz sua", 'marca <span class="dot">acontecer.</span>'], "data-sb-line") + "</h1>" +
      '<div class="sb-hero-img" data-sb-hero-img><div class="abs-fill">' + heroMedia(slot("sobre.hero"), slot("sobre.heroVideo"), 1200) + '</div></div></div>' +
    '<div class="sb-row sb-bottom"><p data-sb-stag>Uma agência para quem acredita que comunicação não precisa ser igual a todo mundo.</p><span data-sb-stag>Role para conhecer ↓</span></div>' +
  "</section>" +

  '<section class="sb-who"><div class="sb-who-grid">' +
    '<div class="sb-who-copy"><span class="kicker kicker--45" data-sb-stag>(01) Quem é a Bow</span>' +
      "<h2 data-sb-rev>" + lines(["Somos estrategistas, designers,", "criativos e desenvolvedores", "trabalhando juntos para transformar", '<span class="muted-45">negócios através do digital.</span>'], "data-sb-rline") + "</h2>" +
      '<div class="sb-who-ps" data-sb-fadeup><p>Não seguimos fórmulas prontas. Observamos, pensamos, criamos, testamos e construímos.</p><p>Porque cada negócio tem uma história diferente, e cada marca merece uma forma própria de contá-la.</p></div></div>' +
    '<div class="sb-who-media"><div class="sb-who-main" data-sb-par="0.06"><div class="abs-fill" data-sb-scale><img class="cover" src="' + esc(px(slot("sobre.who"), 1200)) + '" alt="Bastidores" decoding="async"></div></div>' +
      '<div class="sb-who-small" data-sb-par="0.2"><img class="cover" src="' + esc(px(slot("sobre.whoSmall"), 1200)) + '" alt="Detalhe" decoding="async"></div></div>' +
  "</div></section>" +

  '<section class="sb-universe"><div class="sb-sticky"><div>' +
    '<span class="kicker kicker--45" data-sb-stag>(02) Nosso universo</span><h2 data-reveal>Design, campanhas,<br>sites e tecnologia.</h2></div></div>' + uni +
  "</section>" +

  '<section class="sb-vision light"><div class="sb-vision-inner">' +
    '<span class="kicker kicker--ondark-light" data-sb-stag>(03) Nossa visão</span>' +
    '<h2 data-sb-words><span data-sb-wline>Design não é decoração.</span><span data-sb-wline>É percepção.</span></h2>' +
    '<div class="sb-vision-copy-wrap"><div class="sb-vision-copy" data-sb-fadeup><p>Antes do post, existe uma estratégia. Antes do site, uma experiência. Antes da campanha, um objetivo.</p>' +
    "<p>Por isso design, marketing e tecnologia fazem parte do mesmo pensamento na Bow. A estética chama atenção, a estratégia dá sentido e a tecnologia faz tudo isso ganhar escala.</p></div></div>" +
  "</div></section>" +

  '<section class="sb-believe"><div class="sb-believe-grid">' +
    '<div class="sb-believe-list"><span class="kicker kicker--45" data-sb-stag>(04) No que acreditamos</span><div class="plist" data-plist>' + prins + "</div></div>" +
    '<div class="sb-believe-media"><div class="pimgs">' + pimgs + '<span class="plabel" data-plabel data-tag>' + PRINCIPLES[0][1] + "</span></div></div>" +
  "</div></section>" +

  '<section class="sb-cta"><div class="sb-cta-inner" data-sb-cta>' +
    "<h2 data-sb-rev>" + lines(["Tem uma ideia?", '<span class="muted-40">Vamos fazer acontecer.</span>'], "data-sb-rline") + "</h2>" +
    '<div class="sb-cta-row" data-sb-fadeup><p>Conte o que você está construindo. A gente começa pela conversa.</p>' +
    '<a class="btn-white" href="' + CONTACT.waHref + '" target="_blank" rel="noopener" data-magnetic>Ser cliente Bow <span class="arrow">→</span></a></div>' +
  "</div></section>" +
  contactSection(false) +
  "</main>";
}
