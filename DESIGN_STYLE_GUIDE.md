# Website Design Style Guide

**Project**: curved-chaos
**Framework**: Astro v5 + React 19
**Styling**: Tailwind CSS v4
**Date**: 2026-01-18

---

## 1. Tech Stack & Architecture

### Core Technologies
- **Framework**: Astro 5.16.2 (SSG with Islands Architecture)
- **UI Library**: React 19.2.0 (for interactive components only)
- **Styling**: Tailwind CSS v4.1.17
- **Icons**: Lucide React v0.555.0
- **Typography**: @tailwindcss/typography
- **Math Rendering**: rehype-katex, remark-math

### Architecture Pattern
- **Astro Islands**: Interactive React components loaded with `client:*` directives
- **SSR/SSG Hybrid**: Static generation with client-side hydration for interactivity
- **Multi-language**: i18n support (zh/en/ja)
- **Component Structure**:
  - `.astro` files for static layouts and pages
  - `.tsx` files for interactive UI components

---

## 2. Color Palette & Theme System

### Theme Implementation
- **Mode**: Light/Dark theme toggle with localStorage persistence
- **Switching**: `dark` class on `<html>` element
- **Prevention**: Anti-flash script in `<head>` for seamless page loads
- **Transition**: Smooth 300-1000ms duration for all theme changes

### Light Mode Colors
```css
Background Base: bg-white
Text Primary: text-gray-900
Text Secondary: text-gray-700
Border: border-gray-200/50
Accent: text-blue-600
Grid Pattern: #80808012 (semi-transparent gray)
Glow Effect: bg-blue-400/20
```

### Dark Mode Colors
```css
Background Base: dark:bg-[#020617] (very deep blue-black)
Text Primary: dark:text-white / dark:text-gray-100
Text Secondary: dark:text-gray-200
Border: dark:border-gray-800/50
Accent: dark:text-blue-400
Grid Pattern: opacity-5 (very subtle)
Glow Effect: dark:bg-purple-900/20
```

### Gradient Accents
- **Primary Gradient**: `from-blue-600 to-purple-600`
- **Text Gradient**: `from-gray-900 to-gray-600` / `dark:from-white dark:to-gray-400`
- **Logo Gradient**: `from-blue-600 to-purple-600`

---

## 3. Background System (Layered Architecture)

### Layer Structure (z-index hierarchy)
```
-z-50: Global base color layer (solid color foundation)
-z-40: Dual background images (day/night)
-z-30: Texture & glow effects (grid + blur)
-z-20: Dynamic particle effects (sakura/rain)
z-0:   Content layer (navigation, main, footer)
z-50:  Navigation header (sticky)
```

### Background Image System
**Dual-Image Approach**: Two separate images that crossfade on theme change

#### Day Mode Image
- **Source**: Unsplash mountain landscape (snowy peaks)
- **URL**: `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b`
- **Opacity**: `opacity-90` (light mode) → `dark:opacity-0` (dark mode)
- **Transition**: 1000ms smooth fade
- **Height**: 70vh
- **Blur**: 1px subtle blur
- **Position**: `object-cover` to fill container

#### Night Mode Image
- **Source**: Unsplash starry sky
- **URL**: `https://images.unsplash.com/photo-1419242902214-272b3f66ee7a`
- **Opacity**: `opacity-0` (light mode) → `dark:opacity-90` (dark mode)
- **Transition**: 500ms smooth fade
- **Blend Mode**: Default (no special blending)
- **Mask**: Linear gradient mask (0% → 60% solid → 100% transparent)

### Overlay Effects
1. **Night Darkening Overlay**: `dark:bg-black/20` for text readability
2. **Bottom Gradient Fusion**: Smooth transition from image to page background
   - Light: `from-transparent via-white/10 to-white`
   - Dark: `from-transparent via-[#020617]/80 to-[#020617]`

### Texture Layer
- **Grid Pattern**: 24px × 24px subtle grid
  - Light: `opacity-40`
  - Dark: `opacity-5`
- **Glow Orb**: 500px × 500px circular blur
  - Light: `bg-blue-400/20`
  - Dark: `bg-purple-900/20`
  - Blur: 120px
  - Blend: `mix-blend-overlay`

### Dynamic Particle Effects (Canvas)
**BackgroundEffect.tsx** - Theme-aware canvas animation

#### Sakura Mode (Light Theme)
- **Particle Type**: Cherry blossom petals
- **Color**: Pink with slight transparency
- **Physics**:
  - Sine wave horizontal drift
  - Rotation animation
  - Gentle falling speed
  - Random starting positions

#### Rain Mode (Dark Theme)
- **Particle Type**: Raindrops
- **Color**: Light gray/white with transparency
- **Physics**:
  - Vertical falling with angle
  - Higher speed than sakura
  - Straight line trajectory
  - Constant respawn

**Performance**: Uses `requestAnimationFrame` + particle recycling

---

## 4. Typography & Text Styles

### Font System
- **Default**: System font stack (TailwindCSS default)
- **Smoothing**: Antialiased
- **Scroll**: `scroll-smooth` on HTML

### Text Hierarchy
```astro
<!-- Headings -->
H1: text-2xl font-bold (gradient text)
Role/Subtitle: text-blue-600 dark:text-blue-400 font-medium

<!-- Body Text -->
Primary: text-gray-900 dark:text-gray-100
Secondary: text-gray-700 dark:text-gray-200
Muted: text-gray-500 dark:text-gray-400
Extra Muted: text-gray-400 dark:text-gray-600

<!-- Links -->
Hover: text-blue-600 dark:text-blue-400
Transition: transition-colors
Underline Animation: bottom-1 w-0 → group-hover:w-full
```

### Special Text Effects
- **Gradient Text**: `bg-clip-text text-transparent bg-gradient-to-r`
- **Drop Shadow**: `drop-shadow-sm` for logo text
- **Tracking**: `tracking-tight` for logo, `tracking-wide` for buttons

---

## 5. Component Design Patterns

### Navigation Header
**File**: `Navigation.astro`

#### Structure
- **Position**: `sticky top-0 z-50`
- **Background**: `bg-white/30 dark:bg-slate-950/30 backdrop-blur-md`
- **Height**: `h-16`
- **Layout**: Flexbox with space-between

#### Logo Design
```astro
<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
  A
</div>
<span>Astro<span class="text-blue-600">V5</span></span>
```

#### Desktop Navigation
- **Display**: `hidden md:flex` (hidden on mobile)
- **Position**: `absolute left-1/2 -translate-x-1/2` (centered)
- **Links**: Hover underline animation (0 width → full width)

#### Mobile Menu
- **Display**: `md:hidden` (hidden on desktop)
- **Type**: Full-screen overlay
- **Animation**: Slide-in from right + backdrop blur
- **Items**: Staggered fade-in animation

#### Right Controls
- Language Selector (dropdown with flags/labels)
- Divider (vertical line, hidden on mobile)
- Theme Toggle (sun/moon icon)
- Mobile Menu Button (hamburger icon)

---

### Footer Component
**File**: `Footer.astro`

#### Design
```astro
<footer class="py-8 border-t border-gray-200/50 dark:border-gray-800/50">
  <!-- Copyright -->
  <p class="text-sm text-gray-500 dark:text-gray-400">
    © {year} Alex Dev
  </p>
  <!-- Tech Stack Info -->
  <p class="text-xs text-gray-400 dark:text-gray-600">
    Built with Astro v5 & Tailwind v4
  </p>
</footer>
```

---

### Hero Section (Homepage)
**File**: `[lang]/index.astro`

#### Layout
- **Centering**: `flex flex-col items-center justify-center`
- **Min Height**: `min-h-[calc(100vh-16rem)]`
- **Spacing**: `py-20 px-4`
- **Animation**: `animate-in fade-in zoom-in duration-700`

#### Avatar Design
```astro
<!-- Gradient ring on hover -->
<div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600
     rounded-full blur opacity-75 group-hover:opacity-100">
</div>
<!-- Avatar image -->
<img class="w-32 h-32 md:w-40 md:h-40 rounded-full
     border-4 border-white dark:border-gray-950 shadow-2xl">
```

#### Name & Role
- **Name**: Gradient text (gray-900 → gray-600 / white → gray-400)
- **Role**: Blue accent color with medium font weight

#### Quote Carousel
- **Component**: `QuoteCarousel.tsx` (client:visible)
- **Animation**: Fade + scale every 4 seconds
- **Content**: Mix of English and Chinese quotes

#### CTA Buttons
**Primary Button** (Email):
```tsx
class="px-8 py-3.5 rounded-full !bg-black !text-white
       dark:!bg-white dark:!text-black
       shadow-xl font-bold tracking-wide"
```

**Secondary Button** (Download CV):
```tsx
class="px-8 py-3.5 rounded-full border-2 border-black dark:border-white
       bg-transparent hover:bg-black hover:text-white
       dark:hover:bg-white dark:hover:text-black"
```

#### Social Icons
- **Layout**: Horizontal flex with gap-6
- **Color**: `text-gray-400` base
- **Hover**: Color changes + `scale-110` transform
- **Icons**: GitHub, Twitter, LinkedIn, Instagram (lucide-react)

---

## 6. Interactive Components (React)

### ThemeToggle.tsx
**Purpose**: Dark/light mode switcher

#### Features
- Sun/Moon icon swap with rotation
- Smooth opacity fade between icons
- Handles SSR hydration (initial state = null)
- LocalStorage persistence
- Toggles `.dark` class on `<html>`

#### Design
```tsx
<button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors relative">
  {/* Icons with opacity-0/100 toggle */}
</button>
```

---

### LanguageSelector.tsx
**Purpose**: Multi-language dropdown menu

#### Features
- Current language display with chevron icon
- Dropdown opens on click
- Click-outside detection to close
- Checkmark on active language
- Navigation links for each locale

#### Design
```tsx
<div class="relative">
  <button class="flex items-center gap-2 hover:bg-gray-100
                 dark:hover:bg-gray-800 rounded-lg">
    {currentLang.label}
    <ChevronDown class="transform transition-transform" />
  </button>

  <div class="absolute right-0 mt-2 bg-white dark:bg-gray-800
              rounded-lg shadow-xl backdrop-blur-sm">
    {/* Language options with checkmarks */}
  </div>
</div>
```

---

### QuoteCarousel.tsx
**Purpose**: Auto-rotating quote display

#### Features
- Array of quotes (English + Chinese mixed)
- 4-second auto-rotation
- Fade + scale animation on transition
- Centered layout with max-width

#### Animation Pattern
```tsx
// isAnimating state controls CSS transitions
class={`transition-all duration-700
         ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
```

#### Quote Structure
```tsx
<blockquote>
  <p class="text-lg italic">{quote.text}</p>
  <footer class="text-sm text-gray-500">— {quote.author}</footer>
</blockquote>
```

---

### MobileMenu.tsx
**Purpose**: Full-screen mobile navigation

#### Features
- Hamburger icon (3 horizontal lines)
- Full-screen overlay with backdrop-blur
- Staggered menu item animations
- Close button in top-right
- Body scroll lock when open

#### Hamburger Animation
```tsx
// Three lines with different transforms
<span class={`block h-0.5 w-6 bg-current transition-all
              ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
<span class={`block h-0.5 w-6 bg-current transition-all
              ${isOpen ? 'opacity-0' : ''}`} />
<span class={`block h-0.5 w-6 bg-current transition-all
              ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
```

#### Overlay Design
```tsx
<div class="fixed inset-0 z-50 bg-white/95 dark:bg-slate-950/95
            backdrop-blur-md">
  {/* Menu items with staggered delays */}
  {items.map((item, i) => (
    <a class={`transform transition-all delay-[${i * 50}ms]`} />
  ))}
</div>
```

---

### BackgroundEffect.tsx
**Purpose**: Canvas particle animation

#### Theme Detection
- Uses `MutationObserver` to watch `.dark` class on HTML
- Switches between sakura/rain modes instantly

#### Particle System
```typescript
interface Particle {
  x: number;        // X position
  y: number;        // Y position
  speed: number;    // Fall speed
  opacity: number;  // Alpha transparency
  size: number;     // Particle size
  angle?: number;   // Rotation (sakura only)
  drift?: number;   // Horizontal wave (sakura only)
}
```

#### Sakura Physics
```typescript
p.y += p.speed;
p.x += Math.sin(p.y / 50 + p.drift) * 0.5; // Sine wave drift
p.angle += 0.01; // Rotation
```

#### Rain Physics
```typescript
p.y += p.speed;
p.x += Math.sin(35 * Math.PI / 180) * p.speed; // Diagonal fall
```

#### Canvas Rendering
- `requestAnimationFrame` loop
- Auto-resize on window resize
- Particle recycling (move to top when out of bounds)
- Fixed canvas at `position: fixed; inset-0; -z-20`

---

## 7. Layout System

### Main Layout (Layout.astro)
**Structure**:
```astro
<html lang={lang} class="scroll-smooth">
  <head>
    <!-- Anti-flash theme script -->
  </head>
  <body class="min-h-screen flex flex-col">
    <Background />      <!-- Layered background system -->
    <Navigation />      <!-- Sticky header -->
    <main class="flex-grow">
      <slot />          <!-- Page content -->
    </main>
    <Footer />          <!-- Bottom footer -->
  </body>
</html>
```

### Responsive Breakpoints
```css
/* Tailwind v4 defaults */
sm: 640px   /* Small screens */
md: 768px   /* Tablets - Navigation switches to mobile menu */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### Container Pattern
```astro
<div class="container mx-auto px-4">
  <!-- Centered content with responsive padding -->
</div>
```

---

## 8. Animation & Transition Principles

### Duration Standards
- **Ultra Fast**: 100-200ms (icon swaps, micro-interactions)
- **Fast**: 300ms (hover states, color changes)
- **Medium**: 500-700ms (fade-ins, component transitions)
- **Slow**: 1000ms (background image crossfades, theme changes)

### Common Patterns

#### Hover Effects
```css
/* Scale up */
transform hover:scale-110
transition-colors

/* Underline grow */
w-0 group-hover:w-full transition-all

/* Background fade */
hover:bg-gray-100 dark:hover:bg-gray-800
```

#### Enter Animations
```css
/* Fade + zoom in */
animate-in fade-in zoom-in duration-700

/* Staggered delays */
delay-[0ms] delay-[50ms] delay-[100ms] delay-[150ms]
```

#### Opacity Transitions
```css
/* Smooth crossfade */
opacity-0 dark:opacity-100 transition-opacity duration-1000
```

---

## 9. Design Philosophy Summary

### Visual Identity
- **Modern Minimalism**: Clean, uncluttered layouts with generous whitespace
- **Atmospheric Depth**: Multi-layered backgrounds create visual depth
- **Smooth Transitions**: Everything fades, scales, or slides smoothly
- **Theme Coherence**: All elements respect light/dark mode

### User Experience
- **Performance First**: Islands architecture for minimal JS
- **Progressive Enhancement**: Works without JS, enhanced with it
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### Technical Excellence
- **Type Safety**: TypeScript for all React components
- **Modern Stack**: Latest Astro, React, Tailwind versions
- **Code Quality**: Well-commented, organized component structure
- **Internationalization**: Multi-language support built-in

---

## 10. File Structure Map

```
src/
├── components/
│   ├── Background.astro          # Layered background system
│   ├── BackgroundEffect.tsx      # Canvas particle animation
│   ├── Navigation.astro          # Header with nav links
│   ├── ThemeToggle.tsx           # Dark/light mode switch
│   ├── LanguageSelector.tsx      # Language dropdown
│   ├── MobileMenu.tsx            # Full-screen mobile nav
│   ├── QuoteCarousel.tsx         # Rotating quotes
│   ├── PostMeta.astro            # Blog post metadata display
│   └── Footer.astro              # Footer component
├── layouts/
│   └── Layout.astro              # Main page wrapper
├── pages/
│   ├── index.astro               # Root redirect to /zh/
│   └── [lang]/
│       ├── index.astro           # Localized homepage
│       └── posts/
│           ├── index.astro       # Blog listing page
│           └── [...slug].astro   # Individual post page
├── content/
│   ├── config.ts                 # Content collections schema
│   └── posts/                    # Blog post markdown files
│       ├── demo.md
│       ├── math-test.md
│       ├── paper-1.md
│       └── modern-web-design.md
├── utils/
│   └── reading-time.ts           # Word count & reading time calculator
└── styles/
    └── global.css                # Tailwind imports + base styles
```

---

## 11. Blog System Design

### Blog Listing Page
**File**: `[lang]/posts/index.astro`

#### Layout Structure
```astro
<div class="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
  <!-- Page Title -->
  <h1 class="text-4xl md:text-5xl font-bold gradient-text">博客</h1>

  <!-- Post Cards -->
  <article class="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm
                  rounded-2xl p-6 md:p-8
                  border border-gray-200/50 dark:border-gray-800/50
                  hover:border-blue-300 dark:hover:border-blue-700">
    <!-- Hero Image -->
    <!-- Title -->
    <!-- Metadata (Date, Reading Time) -->
    <!-- Description -->
    <!-- Tags -->
    <!-- Read More Link -->
  </article>
</div>
```

#### Post Card Design
- **Background**: Semi-transparent white/slate with backdrop blur
- **Border**: Subtle gray border that becomes blue on hover
- **Shadow**: Elevates on hover with blue tint
- **Transition**: Smooth 300ms for all state changes
- **Image**: Scales to 102% on card hover
- **Read More**: Arrow icon slides right on hover

#### Metadata Display
```astro
<div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
  <Calendar icon /> {date}
  <divider />
  <Clock icon /> {reading time}
</div>
```

#### Tags
```astro
<span class="px-3 py-1 text-xs font-medium
             bg-blue-100 dark:bg-blue-900/30
             text-blue-600 dark:text-blue-400
             rounded-full">
  Tag Name
</span>
```

---

### Individual Post Page
**File**: `[lang]/posts/[...slug].astro`

#### Layout Structure
```astro
<article class="container mx-auto px-4 py-12 max-w-4xl">
  <!-- Back Button -->

  <header>
    <!-- Hero Image (if exists) -->
    <!-- Title (gradient text) -->
    <!-- Description -->
    <!-- PostMeta Component -->
    <!-- Tags -->
    <!-- Divider -->
  </header>

  <!-- Article Content (Prose) -->
  <div class="prose prose-lg dark:prose-invert">
    <Content />
  </div>

  <!-- Bottom Navigation -->
</article>
```

#### Typography System (Tailwind Prose)
```css
prose-headings:font-bold
prose-h1:text-4xl
prose-h2:text-3xl
prose-h3:text-2xl

prose-p:text-gray-700 dark:prose-p:text-gray-300
prose-p:leading-relaxed

prose-a:text-blue-600 dark:prose-a:text-blue-400
prose-a:no-underline hover:prose-a:underline

prose-code:text-pink-600 dark:prose-code:text-pink-400
prose-code:bg-gray-100 dark:prose-code:bg-gray-800
prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded

prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950
prose-pre:shadow-xl prose-pre:rounded-xl

prose-blockquote:border-l-4 prose-blockquote:border-blue-500
prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20

prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8

prose-table:border-collapse
prose-th:bg-gray-100 dark:prose-th:bg-gray-800
prose-td:border prose-td:border-gray-200
```

#### Code Blocks
- **Theme**: github-dark (Shiki)
- **Features**: Syntax highlighting, line wrapping
- **Styling**: Dark background, rounded corners, shadow

#### Math Formulas
- **Library**: KaTeX
- **Inline**: `$E = mc^2$` renders as math
- **Block**: `$$...$$` for display equations
- **Styling**: Larger font size (1.1em), scrollable overflow

#### Images
- **Hero Image**: Full width, 256-384px height, rounded-2xl
- **Inline Images**: Auto margins (centered), rounded-xl, shadow-lg
- **Responsive**: max-width: 100%, height: auto

---

### PostMeta Component
**File**: `components/PostMeta.astro`

#### Design
```astro
<div class="flex flex-wrap items-center gap-4 md:gap-6
            text-sm text-gray-600 dark:text-gray-400">

  <!-- Author -->
  <div class="flex items-center gap-2">
    <User icon />
    <span>Alex Dev</span>
  </div>

  <!-- Divider (hidden on mobile) -->
  <div class="hidden sm:block w-px h-4 bg-gray-300"></div>

  <!-- Date -->
  <div class="flex items-center gap-2">
    <Calendar icon />
    <time>March 22, 2024</time>
  </div>

  <!-- Reading Time -->
  <div class="flex items-center gap-2">
    <Clock icon />
    <span>5 min read</span>
  </div>

  <!-- Word Count -->
  <div class="flex items-center gap-2">
    <FileText icon />
    <span>1,234 words</span>
  </div>
</div>
```

#### Features
- **Icons**: lucide-react (User, Calendar, Clock, FileText)
- **Responsive**: Dividers hidden on mobile
- **Localized**: Date formats and text adapt to language
- **Calculation**: Real-time word count and reading time

---

### Content Collection Schema
**File**: `content/config.ts`

```typescript
const posts = defineCollection({
  schema: z.object({
    title: z.string(),              // Required
    pubDate: z.coerce.date(),       // Required, auto-converts to Date
    description: z.string(),         // Required
    author: z.string().default('Alex Dev'),
    tags: z.array(z.string()).optional(),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    lang: z.enum(['zh', 'en', 'ja']).default('zh'),
  }),
});
```

#### Frontmatter Example
```yaml
---
title: "Article Title"
pubDate: 2024-03-22
description: "Brief description"
author: "Alex Dev"
tags: ["Tag1", "Tag2"]
heroImage: "https://example.com/image.jpg"
lang: "zh"
draft: false
---
```

---

### Reading Stats Algorithm
**File**: `utils/reading-time.ts`

#### Process
1. Remove frontmatter (`---...---`)
2. Remove code blocks (`` ```...``` ``)
3. Remove inline code (`` `code` ``)
4. Remove links but keep text (`[text](url)` → `text`)
5. Remove images (`![alt](url)`)
6. Remove markdown symbols (`#`, `*`, `_`, etc.)
7. Count Chinese characters
8. Count English words
9. Calculate reading time:
   - Chinese: 400 chars/minute
   - English: 225 words/minute

#### Output
```typescript
{
  wordCount: 1234,
  readingTime: 5  // minutes
}
```

---

## 12. Key Design Decisions

### Why Astro?
- Zero JS by default for static content
- Islands architecture for targeted interactivity
- Excellent performance and SEO

### Why Dual Background Images?
- Creates distinct visual identity for light/dark modes
- Avoids generic solid color backgrounds
- Smooth crossfade feels more polished than instant swap

### Why Canvas for Particles?
- Better performance than DOM-based animation
- Allows hundreds of particles without lag
- Can respond to theme changes dynamically

### Why Sticky Header?
- Navigation always accessible
- Semi-transparent blur maintains visual hierarchy
- Common modern UX pattern

---

## Notes for Future Development

### Extending the Design
1. **New Pages**: Follow the `[lang]/index.astro` pattern for i18n
2. **New Components**: Use `.tsx` for interactive, `.astro` for static
3. **Color Changes**: Update both light and dark variants
4. **Animations**: Match existing duration standards
5. **Responsive**: Test at md breakpoint (768px) for mobile/desktop switch

### Maintaining Consistency
- Always include dark mode variants
- Use Tailwind classes, avoid inline styles
- Add Chinese comments for complex logic
- Test theme switching on all new components
- Ensure animations respect prefers-reduced-motion

---

**End of Style Guide**
