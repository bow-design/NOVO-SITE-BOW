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

## Painel (cases e imagens)

O endereço `/painel/` abre uma página com login onde dá para:

- adicionar, editar, remover e reordenar cases, cada um com 4 fotos;
- trocar qualquer foto do site ou voltar à original;
- trocar a senha.

As mudanças entram no site na hora. O painel precisa de PHP 8, que a hospedagem Hostinger já tem; no GitHub Pages ele não funciona, e o site mostra o conteúdo padrão de `js/data.js`.

```
painel/           página do painel (index.html, painel.js, painel.css) e api.php
api/content.php   entrega ao site os cases e imagens salvos
data/             config.php (usuário e senha) e content.json. Pasta bloqueada ao navegador
uploads/          imagens enviadas (reduzidas para no máximo 2400 px)
```

`data/` e `uploads/` ficam só no servidor (estão no `.gitignore`). Ao enviar uma nova versão do site, não apague essas duas pastas, ou os cases e imagens voltam ao padrão.

### Subir na Hostinger

1. No hPanel, abra o **Gerenciador de Arquivos** e entre em `public_html`.
2. Envie todos os arquivos deste repositório, exceto as pastas `project/` e `chats/`, que são só referência do design.
3. Abra **`seudominio.com.br/painel/`** logo em seguida. No primeiro acesso, o painel pede para criar o usuário e a senha (mínimo 10 caracteres). Faça isso antes de divulgar o endereço: até lá, quem abrir a página primeiro cria o acesso.

Se esquecer a senha, apague `data/config.php` pelo Gerenciador de Arquivos e abra o painel de novo para criar outra. Os cases e imagens não são perdidos.

Segurança: senha guardada só como hash, bloqueio de 15 min após 5 tentativas erradas, proteção contra envio de formulário por outros sites (CSRF), e só imagens JPG, PNG ou WebP são aceitas.

## Pendências

Clientes 03–06, textos dos cases e fotos (Pexels) são provisórios e agora podem ser trocados pelo painel. O formulário de contato só mostra "Enviado ✓" e ainda não envia para lugar nenhum. Os links de Política de privacidade e Termos não têm página.

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
