# Technical Architecture Document
## Ambar Chandra — Scrollytelling Portfolio

**Version:** 1.0  
**Date:** 2026-06-23  
**Project:** `ishdoot/scrollytellingwebsite`  
**Live URL:** https://ishdoot.github.io/scrollytellingwebsite

---

## 1. Project Overview

A single-page, scrollytelling portfolio website for Ambar Chandra (Communication Designer, Visual & Sound, B.Des DTU Delhi). Built as a fully static React application, deployed for free on GitHub Pages. Designed for recruiter audiences with a dark, minimal typographic aesthetic, scroll-triggered animations, and ambient background audio.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI Framework | React | 19.2.6 | Component tree, state, lifecycle |
| Build Tool | Vite | 8.0.x | Dev server, bundler, asset pipeline |
| Animation | GSAP + ScrollTrigger | 3.15.x | All scroll-triggered and timeline animations |
| Smooth Scroll | Lenis | 1.3.23 | Scroll momentum + GSAP sync |
| Audio | HTML5 Audio API | — | Ambient background music |
| Deployment | gh-pages | 6.3.0 | Pushes `dist/` to `gh-pages` branch |
| Hosting | GitHub Pages | — | Free static hosting via CDN |
| Fonts | Google Fonts | — | Instrument Serif + Inter |
| Linting | ESLint | 10.x | Code quality |

---

## 3. Repository Structure

```
scrollytelling/
├── public/                     # Static assets (copied verbatim to dist/)
│   ├── audio/
│   │   └── ambient.mp3         # Ambient audio (converted from .mp4 via FFmpeg)
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── main.jsx                # React entry point — mounts <App /> into #root
│   ├── App.jsx                 # Root component — Lenis init, section assembly
│   ├── index.css               # Design tokens, reset, global typography scale
│   ├── App.css                 # (unused — Vite scaffold remnant)
│   │
│   ├── data/
│   │   └── projects.js         # Editable project data array (5 entries)
│   │
│   ├── hooks/
│   │   └── useAudio.js         # Custom hook: Audio lifecycle, fade, toggle
│   │
│   └── components/
│       ├── ui/                 # Persistent UI (always mounted)
│       │   ├── Navbar.jsx / .css
│       │   └── AudioPlayer.jsx / .css
│       │
│       └── sections/           # Page sections (rendered in scroll order)
│           ├── Hero.jsx / .css
│           ├── About.jsx / .css
│           ├── Projects.jsx / .css
│           ├── Skills.jsx / .css
│           ├── Resume.jsx / .css
│           └── Contact.jsx / .css
│
├── index.html                  # HTML shell — fonts, meta, #root mount point
├── vite.config.js              # Vite config — base path, React plugin
├── package.json                # Scripts, dependencies, homepage field
├── eslint.config.js
└── dist/                       # Build output (git-ignored on main, deployed to gh-pages)
```

---

## 4. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│                                                                  │
│  index.html                                                      │
│    └─ #root                                                      │
│         └─ <App>                                                 │
│              ├─ Lenis (smooth scroll) ──── GSAP ticker sync      │
│              │                                                   │
│              ├─ <Navbar>          ← scroll listener (active §)  │
│              ├─ <AudioPlayer>     ← useAudio hook                │
│              │                         └─ HTML5 Audio API        │
│              │                              └─ ambient.mp3       │
│              │                                                   │
│              └─ <main>                                           │
│                   ├─ <Hero>       ← GSAP timeline (onload)       │
│                   ├─ <About>      ← GSAP ScrollTrigger           │
│                   ├─ <Projects>   ← GSAP ScrollTrigger           │
│                   │    └─ projects.js (data)                     │
│                   ├─ <Skills>     ← GSAP ScrollTrigger           │
│                   ├─ <Resume>     ← static CTA                   │
│                   └─ <Contact>    ← static links                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Component Architecture

### 5.1 `App.jsx` — Root

**Responsibilities:**
- Initialises Lenis with custom easing (`1 - 2^(-10t)`, duration 1.4s)
- Hooks Lenis into GSAP's ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- Sets `gsap.ticker.lagSmoothing(0)` to prevent dropped frames from disrupting ScrollTrigger
- Assembles the full page component tree
- Cleans up both Lenis and the ticker function on unmount

### 5.2 `Navbar.jsx`

**Responsibilities:**
- Tracks scroll position via a passive `window` scroll listener
- Derives `active` section by iterating over all section IDs and checking `getBoundingClientRect().top <= window.innerHeight / 2`
- Applies frosted-glass styling (`backdrop-filter: blur(16px)`) once `scrollY > 60`
- Programmatic scroll via `element.scrollIntoView({ behavior: 'smooth' })`
- Résumé download: `href="/scrollytellingwebsite/resume.pdf"` with `download` attribute

**State:**
```
active: string   — ID of the currently visible section
scrolled: bool   — whether page has scrolled past 60px
```

### 5.3 `AudioPlayer.jsx` + `useAudio.js`

**Responsibilities:**
- Floating fixed-position button (bottom-right) — single `<button>` element (no nesting)
- Attempts autoplay on mount; sets volume to `targetVolume` (0.3) immediately on resolve (not faded, avoids silent-ON bug)
- ON state: renders 4 `<span class="audio-bar">` elements with staggered CSS `bar-bounce` keyframe animation
- OFF state: renders `<MutedIcon />` SVG (speaker with X)
- Manual toggle fades volume in (1.2s, 25 steps) or out (0.8s, 25 steps) using `setInterval`

**`useAudio` hook state:**
```
playing: bool        — reflects actual audio play state
audioRef: Ref        — holds the live Audio element
fadeTimerRef: Ref    — holds the active setInterval ID
```

**Audio path resolution:**
```js
const src = `${import.meta.env.BASE_URL}audio/ambient.mp3`;
// Resolves to: /scrollytellingwebsite/audio/ambient.mp3
```

**React Strict Mode safety:**  
The `useEffect` creates a fresh `Audio` element on each run. The cleanup function sets `audio.src = ''` and nullifies `audioRef.current`, ensuring the first (discarded) instance is fully released before the second (live) instance is created.

### 5.4 Section Components

Each section follows the same pattern:
1. `useRef` on the section container for GSAP context scoping
2. `useEffect` with `gsap.context(() => { ... }, containerRef)` — scopes all tweens to the DOM subtree
3. Return `() => ctx.revert()` to clean up all tweens on unmount
4. Semantic HTML: `<section id="...">` → `<div class="container">` → content

| Section | Animation | Notes |
|---|---|---|
| `Hero` | GSAP timeline (no ScrollTrigger) — fires on mount | Character-by-character name reveal (`yPercent: 110 → 0`), then tagline + meta fade-in, scroll indicator bounce loop |
| `About` | ScrollTrigger stagger on `.about__animate` elements | Two-column: text left, parallax decorative rings right |
| `Projects` | ScrollTrigger stagger on `.bento__tile` elements | Bento grid hover-expand layout (see §6.1) |
| `Skills` | ScrollTrigger stagger on `.skills__tag` elements per group | 4 discipline groups |
| `Resume` | None | Static CTA with `resume.pdf` download |
| `Contact` | None | Row links with CSS hover arrow reveal |

---

## 6. Key Design Patterns

### 6.1 Bento Grid (Projects)

CSS-only horizontal accordion. No JavaScript for the expand/collapse.

```css
/* Container: flex row, fixed viewport height */
.bento {
  display: flex;
  flex-direction: row;
  height: 68vh;
}

/* Default: each tile shares space equally */
.bento__tile { flex: 1; transition: flex 0.55s cubic-bezier(0.16,1,0.3,1); }

/* On any hover: shrink all siblings, expand hovered tile */
.bento:has(.bento__tile:hover) .bento__tile:not(:hover) { flex: 0.28; }
.bento__tile:hover { flex: 3.5; }
```

The collapsed state renders `.bento__strip` (project number + rotated title via `writing-mode: vertical-rl`). The expanded state reveals `.bento__content` (absolute overlay, `opacity: 0 → 1` with a 0.18s transition delay).

### 6.2 GSAP + Lenis Integration

Lenis intercepts native scroll events and drives a virtual scroll position. For GSAP's ScrollTrigger to read the correct position, it must use Lenis's output rather than `window.scrollY`.

```js
// Every GSAP animation frame, forward elapsed time to Lenis
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0); // prevent GSAP from skipping frames on tab switch
```

### 6.3 Design Token System

All colour, spacing, and typography values live in `:root` custom properties in `src/index.css`.

```css
:root {
  --bg: #0d0d0d;          /* Page background */
  --bg-2: #141414;        /* Elevated surface */
  --bg-3: #1a1a1a;        /* Further elevated */
  --text: #f0f0ee;        /* Primary text */
  --text-muted: #888888;  /* Secondary / labels */
  --accent: #06b6d4;      /* Cyan — interactive / highlight */
  --accent-dim: rgba(6, 182, 212, 0.12);
  --border: rgba(240, 240, 238, 0.08);
  --font-serif: 'Instrument Serif', Georgia, serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 6.4 Typography Scale

Fluid type using `clamp()` throughout — scales continuously between viewport breakpoints, no media query jumps.

| Class / Element | Size | Font | Usage |
|---|---|---|---|
| `h1`, `.t-display` | `clamp(4rem, 10vw, 10rem)` | Serif | Hero name |
| `h2`, `.t-heading` | `clamp(2.6rem, 5.5vw, 5.5rem)` | Serif | Section headings |
| `h3`, `.t-subheadline` | `clamp(1.4rem, 2.2vw, 2rem)` | Serif | Project titles, sub-sections |
| `.t-subheading` | `0.78rem`, uppercase, 0.16em tracking | Sans | Eyebrow labels, meta |
| `.t-body` | `1rem`, 1.8 line-height | Sans | Body paragraphs |

Base font-size: `clamp(15px, 1.1vw, 17px)` on `html`.

---

## 7. Build & Deployment Pipeline

```
Development                    Production
───────────                    ──────────
npm run dev                    npm run deploy
    │                               │
    ▼                               ▼
vite dev server             npm run build (predeploy)
localhost:5173                      │
                                    ▼
                              vite build
                              → dist/
                                ├── index.html
                                ├── assets/
                                │   ├── index-[hash].css  (11.8 kB)
                                │   └── index-[hash].js   (338 kB, ~113 kB gzip)
                                └── audio/ambient.mp3
                                    │
                                    ▼
                              gh-pages -d dist
                                    │
                                    ▼
                           Pushes dist/ contents
                           to gh-pages branch
                                    │
                                    ▼
                           GitHub Pages serves
                           https://ishdoot.github.io
                           /scrollytellingwebsite
```

**Critical config:** The `base` path in `vite.config.js` must match the GitHub repository name exactly. Without this, all JS/CSS/asset `src` and `href` attributes resolve to `/` instead of `/scrollytellingwebsite/`, breaking the deployed site.

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/scrollytellingwebsite/',
})
```

**Git branch strategy:**

| Branch | Contents | How Updated |
|---|---|---|
| `main` | Full source code | `git push origin main` |
| `gh-pages` | Built `dist/` only | `npm run deploy` (automated) |

---

## 8. Data Layer

### `src/data/projects.js`

Single source of truth for all project content. Edit this file to update the Projects section — no component changes needed.

```js
// Structure of each project entry
{
  id: 1,                        // Used as display number in bento strip
  title: 'Project Name',        // Shown in collapsed strip + expanded header
  discipline: 'Visual Design',  // Eyebrow label in expanded tile
  year: '2024',                 // Shown below title in expanded tile
  description: '...',           // Body text in expanded tile
  tags: ['Tag A', 'Tag B'],     // Pill tags in expanded tile
  image: null,                  // Path like '/projects/img.jpg', or null for placeholder
}
```

**To add project images:** Drop files in `public/projects/` and set the `image` field to `/scrollytellingwebsite/projects/filename.jpg`.

---

## 9. Static Assets

| Path | Description | Notes |
|---|---|---|
| `public/audio/ambient.mp3` | Ambient background music | Converted from `.mp4` via FFmpeg (`-vn -codec:a libmp3lame -q:a 2`). ~1.9 MB, 1m 24s, ~185 kbps VBR |
| `public/favicon.svg` | Browser tab icon | SVG — scales to any size |
| `public/icons.svg` | SVG sprite (if used) | Available for section icons |
| `public/resume.pdf` | Downloadable résumé | **Not yet added** — user must drop file here |

---

## 10. Performance Characteristics

| Metric | Value | Notes |
|---|---|---|
| JS bundle | 338 kB raw / ~113 kB gzip | Includes GSAP, Lenis, React |
| CSS bundle | 11.8 kB raw / ~3 kB gzip | All styles in one file |
| Audio asset | ~1.9 MB | Loaded on mount with `preload='auto'`; does not block render |
| Build time | ~115ms | Vite cold build, 40 modules |
| Fonts | External (Google Fonts CDN) | Preconnect hints in `<head>` for faster FOUT mitigation |
| Animations | GPU-composited | GSAP targets `opacity`, `transform` (yPercent, scale) — no layout thrash |

---

## 11. Known Constraints & Decisions

| Decision | Rationale |
|---|---|
| Single-page app, no router | Portfolio is a linear scroll experience; no deep-linking needed |
| No TypeScript | Speed of development for a solo project; ESLint provides basic safety |
| CSS co-location (per-component `.css` files) | Keeps styles near their component; no CSS-in-JS overhead |
| `gh-pages` branch deployment (not Actions) | Simpler setup; `npm run deploy` is one command |
| Audio autoplay at full `targetVolume` (no fade-in on autoplay) | Fade-in on autoplay created a silent ON state, causing users to click the button thinking it was broken, turning audio off. Instant volume on autoplay allows immediate confirmation that audio is working. |
| No state management library | Component-local `useState` and a single custom hook are sufficient for this project's scope |
| CSS `:has()` for bento accordion | Pure CSS — no JS event listeners for hover-expand; `:has()` has full support in all modern browsers (Chrome 105+, Safari 15.4+, Firefox 121+) |

---

## 12. Content Population Checklist

The following items require manual action before the site is production-ready:

- [ ] Update `src/data/projects.js` with real project titles, descriptions, disciplines, years, and tags
- [ ] Add project images to `public/projects/` and update `image` paths in `projects.js`
- [ ] Update contact links in `src/components/sections/Contact.jsx` (email, LinkedIn, Behance, Instagram)
- [ ] Add `public/resume.pdf`
- [ ] Re-deploy: `npm run deploy`
