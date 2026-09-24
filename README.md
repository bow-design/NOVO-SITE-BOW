# Site Bow

Site estático (HTML, CSS e JS puro, sem build), implementado a partir de `project/Site Bow.dc.html`.

```
index.html        header, footer e ponto de montagem das páginas
css/style.css     estilos
js/data.js        conteúdo: cases, soluções, textos, fotos, contatos  ← edite aqui
js/templates.js   HTML de cada página
js/motion.js      animações (GSAP + ScrollTrigger + Lenis)
js/app.js         rotas, header, formulário
vendor/           GSAP 3.12.5, ScrollTrigger, Lenis 1.1.13 (cópias locais)
assets/           logos e gota da Bow
```

**Páginas e links diretos:** `#/` · `#/solucoes` · `#/solucoes/<social-media|identidade-visual|sites|saas-tecnologia|marketing>` · `#/cases` · `#/cases/<attualize|ioa-blumenau|cliente-03…06>` · `#/sobre`

**Rodar localmente:** `python3 -m http.server` na raiz e abrir `http://localhost:8000`.

**Publicar no GitHub Pages:** Settings → Pages → Branch `main`, pasta `/ (root)` → Save.

**Pendências herdadas do design:** clientes 03–06, textos dos cases e fotos (Pexels) são provisórios; o formulário só mostra "Enviado ✓" e ainda não envia para lugar nenhum; os links de Política de privacidade e Termos não têm página.

---

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Site Bow.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Site com quatro páginas` project files (HTML prototypes, assets, components)
