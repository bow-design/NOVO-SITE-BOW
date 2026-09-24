# Bow — Design System

Bow is a marketing/growth agency brand. Wordmark: lowercase **"bow."** — the period is a bright green droplet mark, reused standalone as the brand icon (`assets/mark-bow.png`).

## Sources provided
- `LOGO.svg` → full "bow." wordmark (b, o, w + green dot), cleaned copy at `assets/logo-bow.svg` / white variant `assets/logo-bow-white.svg`.
- `LOGO SF.png` → the standalone green droplet mark, cropped to `assets/mark-bow.png`.
- `MOCKUP-IPAD.jpg` → brand mood reference (dark, grainy, moody tablet mockup) at `shots/mockup-ipad.jpg`.
- 6 screenshots of **agencianoz.com** (`shots/s1.png`–`s6.png`) — used **only as a visual/layout style reference** (per user instruction), not as Bow's own product and not as its color source. Its dark backgrounds, pill buttons, numbered process cards, and full-bleed photography hero informed the tokens' *layout*; all actual color tokens are green-only, per Bow's own logo mark.
- No codebase or Figma file was attached — components and the UI kit are original builds sized to the brand.

## Content fundamentals
- Copy is Portuguese (pt-BR), direct and outcome-focused: short sentences, verbs first ("Organizamos", "Diagnosticamos", "Desenhamos").
- Tone is confident and consultative, not salesy — no exclamation points, no emoji.
- "Você/seu" (informal second person) is used when addressing the client's business.
- Headlines mix plain-color and gradient/accent-color words for emphasis (e.g. one or two words in the brand-green gradient inside a white headline).
- Numbered steps ("001", "002"…) are used to narrate process/methodology.

## Visual foundations
- **Color**: near-black surfaces (`--bow-black #0a0a0a`) as the default background; bright brand green (`--bow-green #06e006`, sampled from the logo mark) as the primary accent, with a light-to-deep green gradient (`--accent-gradient`) for CTAs, tags and headline emphasis — the palette is green-only; the reference site's magenta/coral was style inspiration only and was removed from all tokens.
- **Type**: `Sora` (display/headlines, 700–800 weight, tight tracking, big scale) + `Inter` (body/UI). **Substituted from Google Fonts** — no font files were provided; see Caveats.
- **Spacing**: 4px base scale (4→128px), generous section padding (64–96px vertical).
- **Backgrounds**: full-bleed dark photography with a heavy dark gradient overlay for hero sections; flat black or flat white for content sections. No repeating patterns/textures beyond photographic grain.
- **Shape language**: everything is heavily rounded — pill buttons/badges (`--radius-pill`), 16–28px card radii, organic blob-shaped section dividers in the reference site (not yet replicated in components — flagged below).
- **Shadows**: soft, dark, low-contrast (`--shadow-sm/md/lg`); a green glow shadow (`--shadow-glow-green`) for green accent elements.
- **Motion**: fast, subtle — 120–200ms ease-standard transitions; buttons brighten slightly and scale down ~3% on press. No bounce, no long fades.
- **Hover/press**: hover = brightness increase (`filter: brightness(1.12)`) rather than a color swap; press = scale(0.97).
- **Transparency/blur**: sticky header uses a translucent dark background with backdrop-blur.
- **Imagery tone**: cool, dark, moody, slightly grainy — concrete/studio textures, low-key lighting (see `guidelines/brand-photography.html`).

## Iconography
No icon font, SVG icon set, or icon library was provided in the source files. The reference site uses simple line icons (checkmark, target, speech bubble) at a light stroke weight. **Substitution flagged**: if icons are needed, use a CDN set matching a light 1.5px stroke, e.g. Lucide (`https://unpkg.com/lucide-static`) — not yet wired into any component. No emoji in the brand voice.

## Caveats — please help iterate
1. **Fonts are a Google Fonts substitution** (Sora + Inter) — no real Bow font files were provided. If Bow has licensed fonts, send the files and I'll swap `tokens/typography.css`.
2. **No component library or codebase was attached** — the 11 components below are a standard set sized to a marketing-agency brand, not extracted from a real Bow product. If Bow has an existing site/app, connect it and I'll rebuild components to match exactly.
3. The reference site's **organic blob-shaped section dividers** (curved section transitions) aren't yet in any component — flag if you want that motif added.
4. `agencianoz.com` was used strictly as a style reference per your instruction — the Website UI kit's copy and structure are original to Bow, not copied verbatim from NOZ.

## Index
- `styles.css` — root stylesheet, imports everything in `tokens/`.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css` (radius/shadow/motion).
- `assets/` — `logo-bow.svg` (black wordmark), `logo-bow-white.svg` (white wordmark), `mark-bow.png` (droplet mark).
- `shots/` — reference imagery: `mockup-ipad.jpg` (brand mood), `s1.png`–`s6.png` (NOZ style reference, cropped `logo-sf-crop.png`).
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand groups).
- `components/forms/` — `Button`, `IconButton`, `Input`, `Select`, `Checkbox`, `Switch`.
- `components/feedback/` — `Badge`, `Tag`, `Tooltip`.
- `components/surfaces/` — `Card`, `Dialog`.
- `ui_kits/website/` — full click-through recreation of the Bow marketing homepage (`index.html`).
- `SKILL.md` — portable skill file for use in Claude Code.
