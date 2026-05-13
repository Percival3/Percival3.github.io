---
title: "Designing a Minimalist Hand-Drawn Personal Site"
date: "May 2, 2026"
author: "Z.PC"
description: "Exploring spatial metaphors and rough.js to create a website that feels like a sketchbook rather than a typical corporate template..."
---

When thinking about how a personal website should look, we often fall into the trap of using the same clean, highly-polished layouts seen in SaaS products. But a personal space should be exactly that—**personal**.

## The Sketchbook Metaphor

I wanted the site to feel like opening a physical sketchbook. To achieve this, I discarded standard border radii and drop shadows in favor of [Rough.js](https://roughjs.com/). It renders SVG elements that look intentionally hand-drawn, with slight bowing and variable stroke weights.

> "The digital world is perfectly precise. To add humanity, we must intentionally inject chaos."

## Navigation as a Space

Instead of a standard top navbar, the homepage uses a spatial metaphor: **a staircase with doors**. You don't just click a link; you "step" into a room. 

By using absolute positioning over a `viewBox` driven SVG canvas, the stairs act as a responsive framework where the "Blog", "Research", and "About" doors sit at different elevations.

## Technical Implementation

The stack is built on **Astro** and **Tailwind CSS v4**. Astro's island architecture is perfect here:

- The bulk of the pages are static HTML.
- The hand-drawn elements (like the stairs and dividers) are hydrated as React components only where needed.

Next up is adding Framer Motion to create the 3D "pushing open the door" transition effect. But for now, the static structure provides exactly the right canvas.
