# Developer Portfolio

A scroll-driven developer portfolio built with **Next.js (App Router)**, **Three.js** (via React Three Fiber), **GSAP + ScrollTrigger**, and **Lenis** smooth scroll.

## Features

- Custom GLSL shader-distorted mesh as the hero centerpiece (reacts to scroll + mouse)
- Floating particle field for depth
- Smooth scrolling (Lenis) synced to GSAP ScrollTrigger
- Scroll-reveal animations, parallax project art, magnetic buttons
- Custom cursor, animated preloader, glassmorphic UI on a minimal-dark theme
- Fully responsive

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Make it yours

Almost everything lives in one file: [`lib/site.ts`](lib/site.ts).

- `site` — your name, role, tagline, email, socials
- `skills` — the toolbox chips
- `projects` — add / edit project cards (each gets a gradient art panel, tags and links)

To change the look:

- **Colors / theme** → `tailwind.config.ts` (the `ink` and `accent` palettes)
- **Hero blob colors** → the `uColorA/B/C` uniforms in [`components/three/DistortedMesh.tsx`](components/three/DistortedMesh.tsx)
- **Fonts** → the Google Fonts import + CSS variables in [`app/globals.css`](app/globals.css)

## Deploy

Works out of the box on **Vercel**:

```bash
npm run build
```

Then push to GitHub and import the repo in Vercel.

## Tech

| Concern        | Tool                          |
| -------------- | ----------------------------- |
| Framework      | Next.js 14 (App Router)       |
| 3D             | three.js, @react-three/fiber, drei |
| Animation      | GSAP + ScrollTrigger          |
| Smooth scroll  | Lenis                         |
| Styling        | Tailwind CSS                  |
