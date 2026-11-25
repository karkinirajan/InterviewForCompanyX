---
title: HTML, CSS and the browser
level: 0
summary: Semantic HTML, the CSS layout systems you actually need, accessibility basics and how the browser renders a page.
outcomes:
- Write semantic, accessible HTML
- Lay out pages with flexbox and grid
- Explain the critical rendering path at a working level
keypoints:
- 'Use semantic elements: `<button>` for actions, `<a>` for navigation, `<label>` for inputs.'
- Use flexbox for one dimension and grid for two, with mobile-first responsive layouts.
- 'Accessibility basics: keyboard reachable, visible focus, contrast, alt text, `aria-live` for updates.'
- Rendering goes HTML→DOM, CSS→CSSOM, then layout, then paint. Heavy scripts block it.
projects:
- name: Accessible pricing page
  stack:
  - HTML
  - CSS grid
  - Lighthouse
  - axe
  build: A responsive three-tier pricing page with a light/dark theme via CSS variables, scoring 100 on Lighthouse accessibility.
  practises: Semantics, layout, theming, a11y testing.
- name: Keyboard-only form wizard
  stack:
  - HTML
  - CSS
  - vanilla JS
  build: A three-step form with validation messages announced via aria-live, fully usable without a mouse.
  practises: Focus management and accessible feedback.
---

## Why this matters

Every framework compiles to HTML, CSS and JavaScript. When a layout breaks, a button isn't reachable by keyboard, or a page is slow, the fix is at this level.

## Core ideas

- **Semantic HTML:** use the element that means what you mean: `<button>` for actions, `<a>` for navigation, `<nav>`, `<main>`, `<article>`, `<label>` tied to inputs. Screen readers, search engines and keyboard users depend on it.
- **The box model:** content, padding, border, margin. Set `box-sizing: border-box` globally.
- **Layout:** **flexbox** for one dimension (a row of buttons), **grid** for two (a page or card layout).
- **Responsive design:** fluid widths, `minmax()`, media or container queries, mobile first.
- **CSS variables** (`--accent`) for themes, including light and dark.
- **Rendering:** HTML → DOM, CSS → CSSOM, combined into a render tree → layout → paint. Large scripts in `<head>` block rendering.

## Accessibility basics

- Every input has a `<label>`; every image has `alt` text (empty `alt=""` if decorative).
- Everything clickable is reachable and usable with the keyboard; focus is visible.
- Colour contrast is sufficient in both themes.
- Dynamic updates that matter (a finished AI answer, an error) are announced (`aria-live="polite"`).

## How to do it

```html
<main>
  <form aria-describedby="q-help">
    <label for="q">Ask about your policy documents</label>
    <textarea id="q" name="q" required maxlength="4000"></textarea>
    <p id="q-help">Answers cite the documents they used.</p>
    <button type="submit">Ask</button>
  </form>
  <section aria-live="polite" id="answer"></section>
</main>
```

```css
.layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 2rem; }
@media (max-width: 960px) { .layout { grid-template-columns: 1fr; } }
```

## Common mistakes

- `<div onclick>` instead of `<button>` (not focusable, no keyboard support).
- Removing focus outlines without replacing them.
- Fixed pixel widths that break on phones.

## Interview follow-ups

- **"How do you make a custom dropdown accessible?"** Prefer native `<select>`; if custom, follow the ARIA combobox/listbox pattern with keyboard support (arrows, Enter, Escape), focus management and announced state, tested with a screen reader.
- **"What causes layout shift and how do you prevent it?"** Images, ads or fonts loading without reserved space. Set width and height (or aspect-ratio), reserve space for dynamic content, use `font-display` carefully.
- **"What is the critical rendering path?"** HTML, CSS and synchronous scripts the browser needs before first paint. Keep CSS small, defer non-critical JavaScript, preload key assets.

## Check yourself

<details markdown="1"><summary>Why use `<button>` instead of a clickable `<div>`?</summary>

A button is focusable, works with Enter and Space, is announced as a button by screen readers and can submit forms. A div needs all of that rebuilt by hand and usually isn't.

</details>

<details markdown="1"><summary>Flexbox or grid for a two-column page layout with a sidebar?</summary>

Grid: it's two-dimensional layout. Flexbox is ideal inside the parts, for rows of items.

</details>

## Build it

Build the question form above with a responsive two-column layout and test it using only the keyboard.

## What comes next

[4.2 React fundamentals](/04-frontend/02-react-fundamentals).
