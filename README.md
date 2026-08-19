# Cypher Pro 75% 3D Configurator
(FE-AA2: Your First 3D Experience on the Web)

## Overview
Welcome to the **Cypher Pro 75% 3D Configurator**—a highly interactive, premium 3D landing page and product configurator for a fictional mechanical keyboard brand. 

This project bridges the gap between modern web UI and immersive 3D experiences. As the user scrolls down the page, the 3D keyboard model seamlessly scales, rotates, and translates to frame distinct sections of the page using scroll-driven animations.

## Key Features & Interactions
- **Scroll-Driven Cinematics**: The camera and 3D model physically transition through 4 distinct stages as the user scrolls, controlled by `gsap` and `ScrollTrigger`.
- **Real-Time Keycap Customization**: Users can select from 6 distinct keycap themes, which instantly swap the texture UV maps on the 3D model with zero lag.
- **Auditory Switch Feedback**: Exploring the 'Switches' section allows users to click on different mechanical switch options (Blue, Red, Brown, Black). Each click plays a unique, authentic typing sound corresponding to that switch type while dynamically updating the surrounding UI.

## Technology Stack
- **React + TypeScript + Vite**
- **React Three Fiber (@react-three/fiber)** & **Drei (@react-three/drei)**
- **Three.js** (Core 3D engine)
- **GSAP & ScrollTrigger** (Animation and scroll integration)
- **Zustand** (Global state management for configurator selections)
- **TailwindCSS** (Responsive UI styling)

## Performance & Responsibility (FE-10 Lens)
Shipping 3D to the web requires a strict performance budget to ensure accessibility and maintain frame rates across devices:

1. **Lazy Loading & Fallbacks**: The 3D `<Canvas>` is wrapped in a `<Suspense>` boundary. A custom `<CustomLoader>` covers the screen and tracks asset loading progress (via `useProgress`). The scene remains completely hidden until all heavy textures, meshes, and HDRI environments are fully fetched.
2. **Mobile Optimization**: The layout is fully responsive. Using a custom `isMobile` window resize listener, the 3D model scales down dramatically and shifts its Y-position on mobile devices to ensure it stays perfectly in frame without clipping. The configurator UI also adapts from a scrollable row to a highly-visible flex grid.
3. **Shadows & Lighting**: Instead of computing expensive real-time directional shadows across hundreds of keys, the project utilizes Drei's `<ContactShadows>`. This bakes a projected, blurred shadow onto a single flat plane beneath the model, simulating soft studio lighting at a fraction of the GPU cost, maintaining a solid 60FPS even on mobile.
4. **Environment Maps**: An optimized `1k` HDRI (`preset="city"`) is used for realistic metal/plastic reflections, keeping initial bandwidth strictly budgeted.

## Future Enhancements
- **Dynamic Lighting Changes**: Transitioning environment lighting (e.g., from bright daylight to a dark neon gamer room) depending on the selected switch or keycap theme.
- **Exploded View Animation**: Adding an interaction that "explodes" the keyboard to reveal the internal gasket mount, PCB, and foam layers.
- **Custom Texture Uploads**: Allowing users to upload their own images and dynamically map them onto the keycaps.

---

## Acknowledgements

<img src="./public/flyrank-ai.png" alt="FlyRank AI" width="200" />

This 3D configurator experience was proudly built during a Frontend AI Engineering Internship at **FlyRank AI**. 
