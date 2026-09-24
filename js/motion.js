/* Movimento do site: GSAP + ScrollTrigger + Lenis.
   initGlobalMotion() roda uma vez; initPageMotion() roda a cada troca de página
   e tudo o que ela cria fica no pageCtx, desfeito em killPageMotion(). */

const EASE = "power3.out";
let lenis = null;
let pageCtx = null;
let pageCleanup = [];

const $ = (sel, el) => (el || document).querySelector(sel);
const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
const isFine = () => window.matchMedia("(pointer:fine)").matches;

/* ---------- Palavras com máscara (títulos) ---------- */
function maskWords(el) {
  if (el.dataset.masked) return;
  el.dataset.masked = "1";
  const walk = (node) => {
    Array.from(node.childNodes).forEach((ch) => {
      if (ch.nodeType === 3) {
        const parts = ch.textContent.split(/(\s+)/);
        if (!parts.some((p) => p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (!p.trim()) { frag.appendChild(document.createTextNode(" ")); return; }
          const o = document.createElement("span");
          o.style.cssText = "display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em";
          const i = document.createElement("span");
          i.className = "rw"; i.style.display = "inline-block"; i.textContent = p;
          o.appendChild(i); frag.appendChild(o);
        });
        node.replaceChild(frag, ch);
      } else if (ch.nodeType === 1 && ch.tagName !== "BR") walk(ch);
    });
  };
  walk(el);
}

/* ---------- Global (uma vez) ---------- */
function initGlobalMotion() {
  gsap.registerPlugin(ScrollTrigger);
  if (isFine() && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((t) => lenis && lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // Botões magnéticos fixos (header e footer); os das páginas ficam no pageCtx.
  if (isFine()) $$(".nav-shell [data-magnetic], .site-footer [data-magnetic]").forEach(bindMagnetic);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  if (window.ResizeObserver) new ResizeObserver(fitFooter).observe($(".site-footer"));
}

function bindMagnetic(b) {
  const xTo = gsap.quickTo(b, "x", { duration: .5, ease: EASE }), yTo = gsap.quickTo(b, "y", { duration: .5, ease: EASE });
  b.addEventListener("mousemove", (e) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .22); yTo((e.clientY - r.top - r.height / 2) * .3); });
  b.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
}

function onScroll() { fitFooter(); onBgScroll(); onPathScroll(); }
function onResize() { fitFooter(); onBgScroll(); layoutPath(); applyCar(); }

function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0);
}
function scrollToEl(el) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el); else el.scrollIntoView({ behavior: "smooth" });
}

/* ---------- Por página ---------- */
function killPageMotion() {
  if (pageCtx) { pageCtx.revert(); pageCtx = null; }
  pageCleanup.forEach((f) => f()); pageCleanup = [];
  pathEls = null; bgEls = null; car = null;
}

function initPageMotion(first) {
  const root = $("#root"), main = $("main", root);
  if (!main) return;
  const page = state.route.page;
  const fine = isFine();
  const hidden = document.visibilityState === "hidden";
  const scrubMode = page !== "sobre";
  const q = (s) => $$(s, main);

  pageCtx = gsap.context(() => {
    /* Entrada: menu, fundo do topo, título e elementos [data-intro] */
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    const nav = $("[data-intro-nav]");
    // clearProps: um transform residual no header prenderia o menu do celular (position: fixed) dentro dele.
    if (first && nav) tl.from(nav, { yPercent: -100, opacity: 0, duration: .9, clearProps: "transform,opacity" }, .05);
    const bg = $("[data-hero-bg]", main);
    if (bg) tl.fromTo(bg, { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" }, 0);
    const h1 = $("[data-intro-h]", main);
    if (h1) { maskWords(h1); tl.from($$(".rw", h1), { yPercent: 115, duration: 1.05, ease: "power4.out", stagger: .045 }, .3); }
    const intro = q("[data-intro]");
    if (intro.length) tl.from(intro, { y: 22, opacity: 0, duration: .85, stagger: .1 }, .55);
    if (hidden) tl.progress(1);
    setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, 2600);
    if (!first) {
      const tw = gsap.fromTo(main, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .7, ease: EASE });
      setTimeout(() => { if (tw.progress() < 1) tw.progress(1); }, 1200);
    }

    /* Títulos palavra por palavra: presos ao scroll (Sobre: uma vez só) */
    const skip = "[data-intro],[data-intro-h],[data-sb-rev],[data-sb-words],[data-sb-fadeup],[data-sb-line],[data-sb-stag],[data-card],[data-scrub-scale],[data-ci],[data-ci-card]";
    q("[data-reveal],[data-split]").forEach((el) => {
      maskWords(el);
      const ws = $$(".rw", el);
      if (hidden) return;
      if (scrubMode) {
        gsap.fromTo(ws, { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none", stagger: .08,
          scrollTrigger: { trigger: el, start: "top 96%", end: "top 58%", scrub: .9 } });
        return;
      }
      gsap.set(ws, { yPercent: 115 });
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true,
        onEnter: () => gsap.to(ws, { yPercent: 0, duration: .95, ease: "power4.out", stagger: .022, overwrite: true }) });
    });

    /* Blocos, parágrafos e etiquetas */
    const fades = q("[data-fade]").filter((el) => !el.closest(skip) && !(el.parentElement && el.parentElement.closest("[data-fade]")));
    const auto = q("p, h3, h1, form, a[data-magnetic], label").filter((el) =>
      !el.closest(skip + ",[data-fade],[data-reveal],[data-split],[data-work],[data-sb-hero-img]") &&
      !el.querySelector("[data-sb-line],[data-sb-rline],[data-sb-wline]") &&
      !(el.parentElement && el.parentElement.closest("form")));
    const tags = q("[data-tag]").filter((el) => !el.closest(skip + ",[data-fade],[data-work],[data-reveal],[data-mtrack]"));
    if (!hidden && scrubMode) {
      tags.forEach((el) => gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "power1.out",
        scrollTrigger: { trigger: el, start: "top 98%", end: "top 74%", scrub: .9 } }));
    } else if (!hidden && tags.length) {
      gsap.set(tags, { opacity: 0, y: 12 });
      ScrollTrigger.batch(tags, { start: "top 94%", once: true, onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: .6, ease: EASE, stagger: .05, overwrite: true }) });
    }
    // No modo scroll, o que está na primeira seção (topo) não anima: já aparece de cara.
    const firstSec = $("section", main);
    const inHero = (el) => firstSec && !firstSec.id && firstSec.contains(el);
    const all = fades.concat(auto).filter((el) => !(scrubMode && inHero(el)));
    if (!hidden && scrubMode) {
      all.forEach((el) => gsap.fromTo(el, { opacity: 0, y: 70, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", ease: "power1.out",
        scrollTrigger: { trigger: el, start: "top 100%", end: "top 66%", scrub: .9 } }));
    } else if (!hidden && all.length) {
      gsap.set(all, { opacity: 0, y: 26 });
      ScrollTrigger.batch(all, { start: "top 92%", once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: .85, ease: EASE, stagger: .07, overwrite: true }) });
    }
    if (!scrubMode) setTimeout(() => {
      // Rede de segurança: nada visível na tela fica escondido.
      all.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < .05) gsap.to(el, { opacity: 1, y: 0, duration: .5 }); });
      $$(".rw", main).forEach((w) => { const r = w.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0 && w._gsap && Math.abs(gsap.getProperty(w, "yPercent")) > 50 && !gsap.isTweening(w)) gsap.to(w, { yPercent: 0, duration: .5 }); });
    }, 2600);

    /* Tecnologia: barras, processo automatizado, janelas em leque */
    q("[data-bars]").forEach((b) => {
      if (hidden) return;
      gsap.set(b.children, { scaleY: .08 });
      ScrollTrigger.create({ trigger: b, start: "top 88%", once: true, onEnter: () => gsap.to(b.children, { scaleY: 1, duration: 1.1, ease: "power4.out", stagger: .07 }) });
    });
    q("[data-auto]").forEach((box) => {
      const checks = $$("[data-auto-check]", box), ticks = $$("[data-auto-tick]", box), cards = $$("[data-auto-step]", box);
      const t2 = gsap.timeline({ repeat: -1, repeatDelay: .4, paused: true });
      checks.forEach((c, i) => {
        t2.to(c, { backgroundColor: "#06e006", borderColor: "#06e006", duration: .3, ease: EASE }, i * .75)
          .fromTo(ticks[i], { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .35, ease: "back.out(2)" }, i * .75 + .05)
          .to(cards[i], { borderColor: "rgba(6,224,6,.55)", duration: .3 }, i * .75);
      });
      t2.to(checks, { backgroundColor: "#fff", borderColor: "#cfd3cc", duration: .4 }, "+=1.4").to(ticks, { opacity: 0, duration: .3 }, "<").to(cards, { borderColor: "#e0e2de", duration: .4 }, "<");
      ScrollTrigger.create({ trigger: box, start: "top 90%", end: "bottom top", onToggle: (s) => s.isActive ? t2.play() : t2.pause() });
    });
    q("[data-sys]").forEach((c) => {
      const w = $$("[data-win]", c), box = w[0] && w[0].parentElement;
      const step = () => box ? Math.max(0, Math.min(70, (box.clientWidth - w[0].offsetWidth - 12) / 2)) : 0;
      gsap.fromTo(w, { x: 0, rotate: 0 }, { x: (i) => i * step(), rotate: (i) => (i - 1) * 2.5, ease: "none",
        scrollTrigger: { trigger: c, start: "top 85%", end: "center 45%", scrub: .6, invalidateOnRefresh: true } });
    });
    q("[data-scrub-scale]").forEach((el) => gsap.fromTo(el, { scale: .84, y: 60 }, {
      scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: .6 },
    }));

    /* Cards de case: degradê com ruído + zoom leve no hover */
    q("[data-work]").forEach((card) => {
      const img = $("[data-work-img]", card), ovl = $("[data-work-ov]", card);
      if (!img) return;
      gsap.set(img, { scale: 1.02, force3D: true });
      card.addEventListener("mouseenter", () => { gsap.to(img, { scale: 1.07, duration: .8, ease: EASE, overwrite: "auto" }); gsap.to(ovl, { opacity: 1, duration: .45, ease: EASE, overwrite: "auto" }); });
      card.addEventListener("mouseleave", () => { gsap.to(img, { scale: 1.02, duration: .8, ease: EASE, overwrite: "auto" }); gsap.to(ovl, { opacity: 0, duration: .45, ease: EASE, overwrite: "auto" }); });
    });

    /* Fundo do topo segue o mouse */
    if (fine) q("[data-mouse-par]").forEach((el) => {
      gsap.set(el, { scale: 1.05 });
      const xTo = gsap.quickTo(el, "x", { duration: 1, ease: EASE }), yTo = gsap.quickTo(el, "y", { duration: 1, ease: EASE });
      const mv = (e) => { xTo(-(e.clientX / innerWidth - .5) * 16); yTo(-(e.clientY / innerHeight - .5) * 16); };
      window.addEventListener("mousemove", mv);
      pageCleanup.push(() => window.removeEventListener("mousemove", mv));
    });
    if (fine) q("[data-magnetic]").forEach(bindMagnetic);
    $$("a,button", main).forEach((b) => {
      const s = $$("span", b).find((x) => x.textContent.trim() === "→");
      if (!s) return;
      s.style.display = "inline-block";
      b.addEventListener("mouseenter", () => gsap.to(s, { x: 5, duration: .35, ease: EASE }));
      b.addEventListener("mouseleave", () => gsap.to(s, { x: 0, duration: .35, ease: EASE }));
    });

    if (page === "sobre") sobreMotion(main, hidden);
  }, root);

  /* Faixas de clientes: esperam as fontes para medir a largura certa */
  const token = pageCtx;
  document.fonts.ready.then(() => {
    if (pageCtx !== token) return;
    pageCtx.add(() => q("[data-mtrack]").forEach((track) => {
      const half = track.scrollWidth / 2;
      gsap.set(track, { x: 0 });
      gsap.to(track, { x: -half, duration: 38, ease: "none", repeat: -1, modifiers: { x: (v) => (parseFloat(v) % half) + "px" } });
    }));
  });

  // Vídeos de fundo: garante o play no celular (precisa estar sem som).
  $$("video[autoplay]", main).forEach((v) => { v.muted = true; const p = v.play(); if (p) p.catch(() => {}); });

  initCarousel(main);
  initPath(main);
  initBg(main);
  initSobreHover(main);
  fitFooter();
  requestAnimationFrame(() => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 700);
}

/* ---------- Sobre ---------- */
function sobreMotion(main, hidden) {
  const q = (s) => $$(s, main);
  // No celular as linhas dos títulos fluem soltas (display: inline), então o título entra inteiro.
  const narrow = window.matchMedia("(max-width: 720px)").matches;
  const tl = gsap.timeline({ delay: .1 });
  if (narrow) tl.from(q(".sb-mid h1"), { y: 40, opacity: 0, duration: 1.1, ease: "power4.out" });
  else tl.from(q("[data-sb-line]"), { yPercent: 110, duration: 1.15, ease: "power4.out", stagger: .09 });
  tl
    .from(q("[data-sb-stag]").slice(0, 4), { y: 16, opacity: 0, duration: .8, ease: EASE, stagger: .08 }, "-=.9")
    .fromTo(q("[data-sb-hero-img]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" }, "-=1.1");
  if (hidden) tl.progress(1);
  setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, 3000);

  q("[data-sb-stag]").slice(4).forEach((el) => gsap.from(el, { y: 14, opacity: 0, duration: .8, ease: EASE, scrollTrigger: { trigger: el, start: "top 90%" } }));
  q("[data-sb-rev]").forEach((el) => narrow
    ? gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%" } })
    : gsap.from($$("[data-sb-rline]", el), { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .08, scrollTrigger: { trigger: el, start: "top 85%" } }));
  q("[data-sb-fadeup]").forEach((el) => gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: EASE, scrollTrigger: { trigger: el, start: "top 88%" } }));
  q("[data-sb-clip]").forEach((el) => gsap.fromTo(el, { clipPath: "inset(22% 16% 22% 16% round 14px)" }, {
    clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.3, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 92%", once: true },
    onComplete: () => { el.style.clipPath = "none"; },
  }));
  q("[data-sb-par]").forEach((el) => {
    const sp = parseFloat(el.dataset.sbPar) || .15;
    gsap.fromTo(el, { y: () => innerHeight * sp }, {
      y: () => -innerHeight * sp, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: .5, invalidateOnRefresh: true },
    });
  });
  q("[data-sb-scale]").forEach((el) => gsap.fromTo(el, { scale: 1.14 }, {
    scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
  }));
  q("[data-sb-words]").forEach((el) => {
    $$("[data-sb-wline]", el).forEach((ln) => {
      ln.innerHTML = ln.textContent.split(" ").map((w) => '<span class="sbw" style="display:inline-block">' + w + "</span>").join(" ");
    });
    gsap.fromTo($$(".sbw", el), { opacity: .12, y: 12 }, {
      opacity: 1, y: 0, stagger: .12, ease: "none", scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 42%", scrub: true },
    });
  });
  q("[data-sb-cta]").forEach((el) => gsap.fromTo(el, { scale: .88, opacity: .4 }, {
    scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true },
  }));
}

function initSobreHover(main) {
  const list = $("[data-plist]", main);
  if (!list) return;
  const rows = $$("[data-prin]", list), imgs = $$("[data-pimg]", main), label = $("[data-plabel]", main);
  const set = (a) => {
    list.classList.toggle("has-active", a >= 0);
    rows.forEach((r, i) => r.classList.toggle("is-active", i === a));
    const show = a < 0 ? 0 : a;
    imgs.forEach((im, i) => im.classList.toggle("is-on", i === show));
    label.textContent = PRINCIPLES[show][1];
  };
  rows.forEach((r, i) => r.addEventListener("mouseenter", () => set(i)));
  list.addEventListener("mouseleave", () => set(-1));
}

/* ---------- Carrossel "O que fazemos" (arrastar) ---------- */
let car = null, carPos = 2, carTw = null;
const wrapOff = (o) => { const n = SERVICES.length; return ((o % n) + n + n / 2) % n - n / 2; };

function initCarousel(main) {
  const el = $("[data-car]", main);
  if (!el) return;
  car = el;
  const cur = $("[data-car-cursor]", el);
  let start = 0, startPos = 0, down = false, moved = 0;
  const spacing = () => Math.min(400, (el.clientWidth || 1000) * 0.26);
  el.addEventListener("pointerdown", (e) => {
    down = true; moved = 0; start = e.clientX; startPos = carPos;
    if (carTw) carTw.kill();
    el.setPointerCapture(e.pointerId); cur.style.transform = "scale(.85)";
  });
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect(); cur.style.left = (e.clientX - r.left) + "px"; cur.style.top = (e.clientY - r.top) + "px";
    if (!down) return;
    const dx = e.clientX - start; moved = Math.max(moved, Math.abs(dx));
    carPos = startPos - dx / spacing();
    applyCar();
  });
  const up = (e) => {
    if (!down) return;
    down = false; cur.style.transform = "scale(1)";
    let target = Math.round(carPos);
    if (moved < 6) {
      const card = document.elementsFromPoint(e.clientX, e.clientY).find((n) => n.dataset && n.dataset.card != null);
      if (card) target = Math.round(carPos + wrapOff(+card.dataset.card - carPos));
    }
    snapCar(target);
  };
  el.addEventListener("pointerup", up);
  el.addEventListener("pointercancel", up);
  el.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { cur.style.opacity = 1; cur.style.transform = "scale(1)"; } });
  el.addEventListener("pointerleave", () => { cur.style.opacity = 0; cur.style.transform = "scale(.6)"; });
  if (window.ResizeObserver) { const ro = new ResizeObserver(applyCar); ro.observe(el); pageCleanup.push(() => ro.disconnect()); }
  applyCar();
}

function snapCar(target) {
  const n = SERVICES.length;
  carTw = gsap.to({ v: carPos }, { v: target, duration: .7, ease: EASE,
    onUpdate() { carPos = this.targets()[0].v; applyCar(); },
    onComplete: () => { carPos = target; setActiveService(((target % n) + n) % n); } });
}

function setActiveService(i) {
  state.svc = i;
  const t = $("[data-svc-title]"), d = $("[data-svc-desc]");
  if (t) t.textContent = SERVICES[i].title;
  if (d) d.textContent = SERVICES[i].desc;
}

function applyCar() {
  if (!car || !car.isConnected) return;
  const W = car.clientWidth;
  if (!W) return;
  const sp = Math.min(400, W * 0.26);
  $$("[data-card]", car).forEach((card) => {
    const o = wrapOff(+card.dataset.card - carPos), a = Math.abs(o);
    const act = Math.max(0, 1 - a);
    card.style.transform = "translateX(" + (o * sp) + "px) translateY(" + (Math.pow(a, 1.4) * 34) + "px) rotate(" + (o * 7) + "deg) scale(" + (1 - Math.min(a, 2) * 0.03) + ")";
    card.style.zIndex = String(100 - Math.round(a * 10));
    card.style.opacity = String(Math.max(0, Math.min(1, 2.7 - a)));
    card.style.borderColor = act > .5 ? "transparent" : "#d9d9d9";
    $$("[data-face]", card).forEach((f) => { f.style.opacity = act; });
    $$("[data-ink]", card).forEach((k) => {
      if (k.tagName === "svg") k.setAttribute("stroke", act > .5 ? "#fff" : "#6b6b6b");
      else k.style.color = act > .5 ? "#fff" : "#111";
    });
  });
}

/* ---------- Caminho do "Nosso método" ---------- */
let pathEls = null;

function initPath(main) {
  const wrap = $("[data-path-wrap]", main);
  if (!wrap) return;
  pathEls = { wrap, p: $("[data-path]", wrap), base: $("[data-path-base]", wrap), drop: $("[data-path-drop]", wrap), lut: null, len: 0, nodeY: [] };
  if (window.ResizeObserver) { const ro = new ResizeObserver(layoutPath); ro.observe(wrap); pageCleanup.push(() => ro.disconnect()); }
  requestAnimationFrame(layoutPath);
}

function layoutPath() {
  const P = pathEls;
  if (!P || !P.wrap.isConnected) return;
  const { wrap, p, base } = P;
  const W = wrap.clientWidth;
  if (W < 200) return;
  const narrow = W < 720;
  const rows = $$("[data-row]", wrap);
  rows.forEach((r, i) => {
    const inner0 = narrow ? 64 : W * .5, outer = narrow ? 0 : W * .07;
    r.style.paddingLeft = (narrow || i % 2 === 0 ? inner0 : outer) + "px";
    r.style.paddingRight = (!narrow && i % 2 ? inner0 : outer) + "px";
    r.style.justifyContent = narrow || i % 2 === 0 ? "flex-start" : "flex-end";
    const inner = r.firstElementChild;
    if (inner) { inner.style.textAlign = !narrow && i % 2 ? "right" : "left"; inner.style.alignItems = !narrow && i % 2 ? "flex-end" : "flex-start"; }
  });
  const H = wrap.clientHeight;
  const pts = rows.map((r, i) => [narrow ? 24 + (i % 2 ? 16 : 0) : W * (i % 2 ? .86 : .14), r.offsetTop + r.offsetHeight / 2]);
  const x0 = narrow ? 24 : W * .5;
  let d = "M" + x0 + ",0", px0 = x0, py = 0;
  pts.concat([[x0, H]]).forEach(([x, y]) => { const k = (y - py) * .62; d += " C" + px0 + "," + (py + k) + " " + x + "," + (y - k) + " " + x + "," + y; px0 = x; py = y; });
  p.setAttribute("d", d); base.setAttribute("d", d);
  const len = p.getTotalLength();
  P.len = len; p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
  const lut = []; for (let i = 0; i <= 240; i++) { const L = len * i / 240; lut.push([L, p.getPointAtLength(L).y]); }
  P.lut = lut;
  P.nodeY = pts.map((pt) => pt[1]);
  $$("[data-node]", wrap).forEach((n, i) => { if (!pts[i]) return; n.style.left = pts[i][0] + "px"; n.style.top = pts[i][1] + "px"; });
  onPathScroll();
}

function onPathScroll() {
  const P = pathEls;
  if (!P || !P.lut || !P.len || !P.wrap.isConnected) return;
  const { wrap, p, drop, lut } = P;
  const r = wrap.getBoundingClientRect();
  const ty = Math.max(0, Math.min(r.height, innerHeight * .55 - r.top));
  let L = 0;
  for (let i = 1; i < lut.length; i++) {
    if (lut[i][1] >= ty) { const [l0, y0] = lut[i - 1], [l1, y1] = lut[i]; L = l0 + (l1 - l0) * ((ty - y0) / Math.max(.001, y1 - y0)); break; }
    L = lut[i][0];
  }
  p.style.strokeDashoffset = P.len - L;
  const pt = p.getPointAtLength(L);
  drop.style.transform = "translate(" + (pt.x - 11).toFixed(1) + "px," + (pt.y - 15).toFixed(1) + "px)";
  $$("[data-node]", wrap).forEach((n, i) => {
    const on = P.nodeY[i] <= ty + 2;
    if (n._on === on) return; n._on = on;
    n.style.background = on ? "#06e006" : "#050505";
    n.style.borderColor = on ? "#06e006" : "rgba(255,255,255,.35)";
    n.style.transform = on ? "scale(1.3)" : "scale(1)";
  });
}

/* ---------- Home: preto → branco entre "Nosso método" e "O que fazemos" ---------- */
let bgEls = null, bgRaf = 0;
function initBg(main) {
  const A = $("[data-bg-a]", main), B = $("[data-bg-b]", main);
  bgEls = A && B ? { A, B } : null;
  onBgScroll();
}
function onBgScroll() {
  if (bgRaf) return;
  bgRaf = requestAnimationFrame(() => {
    bgRaf = 0;
    if (!bgEls || !bgEls.A.isConnected) return;
    const vh = innerHeight, top = bgEls.B.getBoundingClientRect().top;
    const t = Math.min(1, Math.max(0, (vh * .65 - top) / (vh * .5)));
    const e = t * t * (3 - 2 * t);
    const c = Math.round(5 + (245 - 5) * e);
    bgEls.A.style.background = bgEls.B.style.background = "rgb(" + c + "," + c + "," + c + ")";
  });
}

/* ---------- Formulário e footer acompanham o scroll ---------- */
function fitForms() {
  const vh = innerHeight;
  $$("main section#contato").forEach((sec) => {
    const r = sec.getBoundingClientRect();
    const card = $("[data-ci-card]", sec);
    if (card) {
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * .75)));
      const q = Math.pow(1 - p, 3);
      card.style.transform = q < .002 ? "none" : "translateY(" + (q * 90).toFixed(1) + "px) scale(" + (1 - q * .05).toFixed(4) + ")";
    }
    const items = $$("[data-ci]", sec);
    if (!sec.dataset.ciInit) {
      sec.dataset.ciInit = "1";
      items.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateY(22px)"; el.style.filter = "blur(5px)"; });
    }
    const show = r.top < vh * .78 && r.bottom > 0;
    if (show && sec.dataset.ciOn !== "1") {
      sec.dataset.ciOn = "1";
      items.forEach((el, i) => {
        const d = 120 + i * 80;
        el.style.transition = "opacity .9s cubic-bezier(.2,.7,.2,1) " + d + "ms, transform 1s cubic-bezier(.2,.7,.2,1) " + d + "ms, filter .9s ease " + d + "ms";
        el.style.opacity = "1"; el.style.transform = "translateY(0)"; el.style.filter = "blur(0)";
      });
    } else if (!show && r.top > vh && sec.dataset.ciOn === "1") {
      sec.dataset.ciOn = "0";
      items.forEach((el) => { el.style.transition = "opacity .3s ease, transform .3s ease, filter .3s ease"; el.style.opacity = "0"; el.style.transform = "translateY(22px)"; el.style.filter = "blur(5px)"; });
    }
  });
}

function fitFooter() {
  fitForms();
  const f = $(".site-footer");
  if (!f) return;
  const r = f.getBoundingClientRect(), vh = innerHeight;
  const span = Math.min(r.height, vh) * .95;
  const p = Math.min(1, Math.max(0, (vh - r.top) / span));
  const items = $$("[data-fi]", f);
  const n = items.length || 1;
  items.forEach((el, i) => {
    const lp = Math.min(1, Math.max(0, (p - i / n * .45) / .55));
    const e = 1 - Math.pow(1 - lp, 3), q = 1 - e;
    el.style.transition = "none";
    el.style.opacity = e.toFixed(3);
    el.style.transform = q < .002 ? "none" : "translateY(" + (q * 70).toFixed(1) + "px)";
    el.style.filter = q < .01 ? "none" : "blur(" + (q * 8).toFixed(2) + "px)";
  });
}
