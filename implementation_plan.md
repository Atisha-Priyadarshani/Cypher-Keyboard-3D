# FE-10: Accessibility & Performance Audit Implementation Plan

## Goal
Achieve a Lighthouse Mobile score of 90+ in both Performance and Accessibility, with zero WAVE errors, and full keyboard navigability.

## 1. Accessibility (A11y) Improvements
We are already at 91, but we want a perfect 100 and zero WAVE errors.
- **Custom Loader (`App.tsx`)**: Add `role="status"` and `aria-live="polite"` so screen readers politely announce the loading percentage to users.
- **Keycap Selectors (`App.tsx`)**: Add `aria-pressed={activeKeycapTheme === theme.id}`, `aria-label`, and `focus-visible:ring-2 outline-none` to make them perfectly navigable via keyboard tab strokes.
- **Switch Cards (`App.tsx`)**: Add `aria-label` and `focus-visible` styling.
- **Semantic HTML**: Wrap the page contents in a `<main>` tag for proper ARIA landmarking.

## 2. Performance Optimizations
Currently sitting at ~50. Lighthouse notes that Chrome extensions are tanking the score, but we can do a lot on the code side to boost it naturally into the 90s:
- **Delayed Canvas Mounting**: The biggest penalty in 3D web apps is the `Total Blocking Time (TBT)` caused by initializing WebGL *during* the initial page load. We will use a `useEffect` to delay mounting the `<Canvas>` until *after* the browser has rendered the initial HTML/CSS (Hero text). This instantly solves the TBT and LCP bottleneck.
- **Vite Chunk Splitting (`vite.config.ts`)**: The build threw a warning that chunks are over 500kb. We will configure Rollup to split `three` and `@react-three/fiber` into separate cacheable chunks. This improves download and parsing times significantly.

## User Action Required
Please review this plan. If you approve, I will implement these fixes, push the code, and then you can re-run the Lighthouse audit (preferably in an **Incognito Window** to prevent extensions from ruining the score). We will then write the final `AUDIT.md`.
