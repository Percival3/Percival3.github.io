# Website Design Style Guide

## Scope
This guide documents the current visual system implemented in this repository.
It is based on actual code in `src/components`, `src/layouts`, `src/pages`, and `src/styles`.

## 1. Design Direction

The site style combines:

- minimal layout structure
- atmospheric layered backgrounds
- glass-like card surfaces
- blue-focused accent color system
- soft motion and hover feedback

Primary surfaces are semi-transparent white/slate cards over a rich background scene.

## 2. Technical Foundation

- Framework: Astro v5
- Interactive islands: React 19 components with `client:*` hydration
- Styling: Tailwind CSS v4 (`@tailwindcss/vite`)
- Base styles: `src/styles/global.css`
- Dark mode variant: custom `@variant dark (&:where(.dark, .dark *))`

## 3. Theme System

Theme behavior is class-based:

- active mode is controlled by `dark` class on `<html>`
- persisted to `localStorage` key `theme`
- pre-hydration anti-flash script in `src/layouts/Layout.astro`
- toggle UI in `src/components/ThemeToggle.tsx`

Core transition pattern:

- color transitions around `duration-300`
- background image crossfade up to `duration-1000`

## 4. Color and Surface Language

### Base page colors

- Light: white and gray text hierarchy
- Dark: slate/near-black background (`dark:bg-slate-950` / `#020617`) with light text

### Accent usage

- Primary accent: blue (`text-blue-600`, `dark:text-blue-400`)
- Gradients: blue to purple for logo rings and key headings
- Supporting tags/chips: blue and green tints depending on content type

### Surface style

Most cards use:

- `bg-white/50` in light mode
- `dark:bg-slate-900/50` in dark mode
- `backdrop-blur-sm`
- soft borders with blue hover emphasis

This creates a consistent glassmorphism-like UI language.

## 5. Layered Background Architecture

Implemented in `src/components/Background.astro`.

Layer stack:

- `-z-50`: solid base color
- `-z-40`: dual day/night hero images with crossfade
- `-z-30`: grid texture + glow orb
- `-z-20`: animated canvas effect (`BackgroundEffect.tsx`)
- `z-0+`: page content
- `z-50`: sticky navigation

Background details:

- day and night Unsplash images
- top 70vh visual field
- mask gradient to blend into page body
- night overlay for text readability

## 6. Motion System

### Typical durations in use

- 200-300ms: control hover and icon state changes
- 500ms: quote transitions, dark image fade
- 700ms: section entrance animation
- 1000ms: long background/theme crossfade

### Common effects

- fade + zoom on section entry (`animate-in fade-in zoom-in`)
- subtle scale on image/card hover
- directional icon movement for action links
- staggered transition delays in mobile menu items

## 7. Typography

- default font stack: Tailwind/system default
- quote area uses `font-serif`
- headings often use gradient text clipping
- body text follows gray scale hierarchy for contrast

Article/detail pages use Tailwind Prose with customized tokens for:

- headings
- links
- inline code and code blocks
- blockquotes
- tables
- images

## 8. Layout Patterns

### Global layout

From `src/layouts/Layout.astro`:

- sticky navigation at top
- full-page background component
- main content slot with flex-grow
- footer at bottom

### Container rules

Common container classes:

- `container mx-auto px-4`
- content max widths vary by context (`max-w-4xl`, `max-w-6xl`)

### Responsive behavior

- desktop nav appears at `md` and up
- mobile menu appears below `md`
- hero and card grids collapse cleanly to one column on small screens

## 9. Core Component Patterns

### Navigation (`src/components/Navigation.astro`)

- sticky translucent header (`bg-white/30`, `dark:bg-slate-950/30`)
- centered desktop nav links with underline hover animation
- logo badge uses blue-purple gradient
- right controls: language selector, theme toggle, mobile menu

### Mobile Menu (`src/components/MobileMenu.tsx`)

- full-screen overlay panel
- slide/fade opening animation
- body scroll lock when open
- staggered item transitions

### Language Selector (`src/components/LanguageSelector.tsx`)

- compact dropdown trigger
- click-outside close behavior
- active locale highlighted with check icon

### Theme Toggle (`src/components/ThemeToggle.tsx`)

- icon switch between sun/moon
- hydration-safe initial state (`null` before mount)

### Background Effect (`src/components/BackgroundEffect.tsx`)

Canvas animation mode follows theme:

- light mode: sakura-like petals
- dark mode: rain streaks

Theme changes are observed with `MutationObserver` on `<html>` class.

### Quote Carousel (`src/components/QuoteCarousel.tsx`)

- auto-rotates every 4 seconds
- transition uses fade + vertical shift + scale

### Post Meta (`src/components/PostMeta.astro`)

Reusable metadata row for content detail pages:

- author
- date
- reading time
- word count

## 10. Page-Level Composition

### Home (`src/pages/[lang]/index.astro`)

Structure:

1. hero identity block (avatar, role, quote carousel, CTA)
2. featured creative works
3. latest blog posts
4. research highlights

Cards on home use the same glass-card design as collection listings.

### Collection listings

- Blog: `src/pages/[lang]/blog/index.astro`
- Research: `src/pages/[lang]/research/index.astro`
- Gallery: `src/pages/[lang]/gallery/index.astro`

All three listings share:

- section title/subtitle pattern
- sorted cards by date
- hover state with blue accent border/shadow
- tag chips and metadata labels

### Detail templates

- Blog detail: `src/pages/[lang]/blog/[...slug].astro`
- Research detail: `src/pages/[lang]/research/[...slug].astro`
- Gallery detail: `src/pages/[lang]/gallery/[...slug].astro`

Each template has:

- back link to list page
- optional hero/preview image
- metadata block and tags
- styled markdown content area
- bottom return CTA

## 11. Design Consistency Rules for Future Changes

When adding or updating UI, keep these rules:

1. Provide both light and dark variants.
2. Keep card surfaces semi-transparent with subtle borders.
3. Use blue as primary interaction accent.
4. Keep motion soft and short; avoid abrupt transforms.
5. Match existing container widths and spacing rhythm.
6. Preserve readable contrast on top of atmospheric backgrounds.
7. Reuse existing component patterns before creating new ones.

## 12. Quick Reference Map

- Global wrapper: `src/layouts/Layout.astro`
- Background system: `src/components/Background.astro`
- Theme toggle: `src/components/ThemeToggle.tsx`
- Navigation: `src/components/Navigation.astro`
- Mobile nav: `src/components/MobileMenu.tsx`
- Locale switcher: `src/components/LanguageSelector.tsx`
- Animation canvas: `src/components/BackgroundEffect.tsx`
- Article metadata: `src/components/PostMeta.astro`
- Base CSS: `src/styles/global.css`

Use this file as the style baseline when introducing new routes or components.
