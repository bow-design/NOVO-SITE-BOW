/* Rastreamento: Microsoft Clarity, Google Analytics 4 e Pixel da Meta.
   Os códigos vêm do painel (aba Rastreamento). Nada é carregado antes de o
   visitante aceitar os cookies (LGPD); sem nenhum código configurado, o aviso nem aparece. */

const Tracking = (() => {
  const KEY = "bow_consent"; // "granted" | "denied"
  let ids = {}, loaded = false;

  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* navegação privada */ } },
  };
  const hasAny = () => !!(ids.clarity || ids.ga4 || ids.metaPixel);

  function addScript(src, inline) {
    const s = document.createElement("script");
    if (src) { s.async = true; s.src = src; } else s.text = inline;
    document.head.appendChild(s);
  }

  function load() {
    if (loaded || !hasAny()) return;
    loaded = true;
    if (ids.ga4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag("js", new Date());
      // page_view é enviado a cada troca de página (o site não recarrega entre páginas).
      gtag("config", ids.ga4, { send_page_view: false });
      addScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ids.ga4));
    }
    if (ids.clarity) {
      addScript(null, '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};' +
        't=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);' +
        '})(window,document,"clarity","script",' + JSON.stringify(ids.clarity) + ");");
    }
    if (ids.metaPixel) {
      addScript(null, "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};" +
        "if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;" +
        "s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');" +
        "fbq('init'," + JSON.stringify(ids.metaPixel) + ");");
    }
    pageView();
  }

  /* Endereço "limpo" da página: #/cases/attualize vira /cases/attualize. */
  const path = () => "/" + location.hash.replace(/^#\/?/, "");

  function pageView() {
    if (!loaded) return;
    if (window.gtag && ids.ga4) gtag("event", "page_view", { page_title: document.title, page_location: location.origin + location.pathname.replace(/\/$/, "") + path(), page_path: path() });
    if (window.clarity) clarity("set", "page", path());
    if (window.fbq) fbq("track", "PageView");
  }

  /* Eventos: nome no GA4 / no Pixel da Meta / etiqueta no Clarity. */
  function event(name, params) {
    if (!loaded) return;
    params = params || {};
    if (window.gtag && ids.ga4) gtag("event", name, params);
    if (window.clarity) clarity("event", name);
    const fbName = { generate_lead: "Lead", whatsapp_click: "Contact" }[name];
    if (window.fbq && fbName) fbq("track", fbName, params);
  }

  /* ---------- Aviso de cookies ---------- */
  function banner(show) {
    let el = document.getElementById("consent");
    if (!show) { if (el) el.remove(); document.documentElement.classList.remove("consent-open"); return; }
    if (!el) {
      el = document.createElement("div");
      el.id = "consent"; el.className = "consent"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Cookies");
      el.innerHTML = '<p>Usamos cookies para entender como o site é usado e melhorar a sua experiência. Você escolhe.</p>' +
        '<div class="consent-btns"><button type="button" class="consent-no" data-consent="denied">Recusar</button>' +
        '<button type="button" class="consent-yes" data-consent="granted">Aceitar</button></div>';
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-consent]");
        if (!b) return;
        store.set(b.dataset.consent);
        banner(false);
        if (b.dataset.consent === "granted") load();
        else if (loaded) location.reload(); // quem recusou depois de aceitar: recarrega sem os rastreadores
      });
      document.body.appendChild(el);
    }
    document.documentElement.classList.add("consent-open");
  }

  function init(trackingIds) {
    ids = trackingIds && typeof trackingIds === "object" ? trackingIds : {};
    const link = document.querySelector("[data-cookie-prefs]");
    if (link) link.hidden = !hasAny();
    if (!hasAny()) return;
    const c = store.get();
    if (c === "granted") load();
    else if (c !== "denied") banner(true);

    // Cliques em qualquer link de WhatsApp do site (botão flutuante, header, CTAs, rodapé).
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href*="wa.me/"]');
      if (!a) return;
      const where = a.closest(".wa-float") ? "botao_flutuante" : a.closest(".site-header, .mnav") ? "menu" : a.closest(".site-footer") ? "rodape" : "pagina";
      event("whatsapp_click", { local: where, pagina: path() });
    });
  }

  return { init, pageView, event, openPrefs: () => banner(true) };
})();
