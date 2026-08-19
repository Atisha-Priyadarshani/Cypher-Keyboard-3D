# Break Your Own Site (Diligence & Hardening)

## 1. Stress Testing & Edge Case Findings

In an effort to rigorously test the application beyond the "happy path," several edge cases, network constraints, and accessibility constraints were simulated. Below is the honest assessment of where the application cracked, and how those cracks were triaged.

### A. The "Fix-Now" Triage (Issues We Addressed)

**1. Lighthouse / Slow Network Blocking (The "Web GL Freeze")**
*   **The Break:** When simulating a slow 4G network (via Lighthouse), the entire browser thread locked up for over 8 seconds. Users clicking the screen during initial load would experience total unresponsiveness.
*   **The Cause:** Eager loading and parsing of the massive `Three.js` and `@react-three/fiber` libraries, combined with module-level `useGLTF.preload()` triggers.
*   **The Fix:** We implemented a strict "Splash Screen" barrier. We ripped out all module-level preloads and conditionally hid the `Canvas` behind a `startExperience` state. 
*   **Status:** Fixed. Total Blocking Time (TBT) dropped from 8,680ms to near 0ms.

**2. Absolute Positioning Breakout on Interactive Elements**
*   **The Break:** When rapidly scrolling or clicking through the "Craft Your Click" section, the background typography ("RED RED RED") and hover gradients would bleed completely out of their containers and overlap the entire page, breaking the layout.
*   **The Cause:** During an accessibility refactor (changing static `div` cards into focusable `<button>` elements), the `relative` and `overflow-hidden` utility classes were stripped.
*   **The Fix:** Re-applied strict `relative overflow-hidden` classes to the interactive `<button>` containers to aggressively clip the absolute-positioned aesthetic elements.
*   **Status:** Fixed.

**3. Progress Loader Opacity Flashing**
*   **The Break:** When clicking "Enter 3D Experience," the main UI would flash on screen for a split second before the loading screen appeared, causing a jarring visual glitch.
*   **The Cause:** The `@react-three/drei` `useProgress()` hook's `active` state has a micro-delay before it triggers to `true` when models begin fetching.
*   **The Fix:** Implemented a rigid `hasLoaded` lock state in `CustomLoader` that forces the loading screen to remain at 100% opacity until progress strictly equals 100%, entirely masking the micro-delay.
*   **Status:** Fixed.

---

### B. Known Limitations (Issues We Accept)

**1. WebGL Context Loss on Legacy Mobile GPUs**
*   **The Break:** When opening the site on an iPhone 6 or an extremely old Android device with limited RAM, the browser crashes the page and reports "WebGL Context Lost".
*   **Triage:** *Known Limitation.* We are loading multiple high-fidelity `.gltf` models (a full keyboard and individual switches). Modern 3D web applications fundamentally require modern hardware. We accept that this app targets mid-to-high-end modern devices.

**2. GSAP ScrollTrigger Jitter on "Enter 3D Experience"**
*   **The Break:** If a user scrolls down the page wildly *while* the 3D assets are loading, the GSAP ScrollTrigger breakpoints occasionally miscalculate the Y-offset because the Canvas hasn't fully hydrated its DOM height.
*   **Triage:** *Known Limitation.* Since we intentionally delay the Canvas rendering for performance scores, the DOM undergoes a layout shift when it finally mounts. We mitigate this by fixing the Canvas to the viewport (`fixed inset-0`), but aggressive scrolling during the exact microsecond of mounting can still cause slight camera target offset.

---

## 2. Findability & Speed (SEO)

To ensure the portfolio is discoverable and presentable when shared:

*   **Meta Tags Added:** Implemented descriptive `<title>`, `<meta name="description">`, and proper OpenGraph (`og:title`, `og:description`, `og:image`) tags in `index.html`.
*   **Social Preview:** Sharing the link on platforms like Discord or LinkedIn now accurately pulls a custom title ("Cypher | Premium 3D Keyboard Configurator") and description, rather than a blank generic Vite template.
*   **Speed Check:** As verified in our previous FE-10 audit, the Lighthouse performance score holds at 89+ on Mobile profiles.
