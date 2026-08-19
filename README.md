# Cypher Pro 75% 3D Configurator
(FE-AA2: Your First 3D Experience on the Web)

## Live URL
*(Pending Deployment via Vercel/Netlify)*

## What I Built
I built a premium, interactive 3D landing page and product configurator for a fictional mechanical keyboard brand called **Cypher**. 

The experience seamlessly blends standard web UI with a dynamic 3D background. As the user scrolls down the page, the 3D keyboard model reacts to the scroll position (using `gsap` and `ScrollTrigger`), scaling, rotating, and moving to perfectly frame the different sections of the page.

Users can interact with the product by:
1. **Scrolling**: The camera and model physically transition through 4 distinct stages.
2. **Configuring Keycaps**: Selecting different keycap themes instantly swaps the texture UV maps on the 3D model.
3. **Exploring Switches**: Clicking on different switch options plays unique, authentic typing sounds corresponding to that switch type (Blue, Red, Brown, Black) while dynamically updating the UI.

## Technology Stack
- **React + TypeScript + Vite**
- **React Three Fiber (@react-three/fiber)** & **Drei (@react-three/drei)**
- **Three.js**
- **GSAP (ScrollTrigger)** for scroll-driven animations
- **Zustand** for global state management (configurator choices)
- **TailwindCSS** for UI styling

## Performance & Responsibility (FE-10 Lens)
Shipping 3D to the web requires a strict performance budget to ensure it doesn't melt the user's phone or tank the frame rate:

1. **Lazy Loading & Fallbacks**: The 3D `<Canvas>` is wrapped in a `<Suspense>` boundary. I implemented a custom `<CustomLoader>` that covers the screen and tracks asset loading progress (via `useProgress`). The scene is completely hidden until all textures, models, and HDRI environments are fully fetched.
2. **Mobile Optimization**: The layout is fully responsive. Using a custom `isMobile` window resize listener, the 3D model dramatically scales down and shifts its Y-position on mobile devices to ensure it stays in frame without clipping. The UI switches from a scrollable row to a highly-visible grid.
3. **Shadows & Lighting**: Instead of computing expensive real-time directional shadows across hundreds of keys, I used Drei's `<ContactShadows>`. This projects and blurs the shadow onto a single flat plane, which looks incredibly premium (soft studio lighting) but costs almost nothing on the GPU, maintaining a solid 60FPS even on mobile.
4. **Environment Map**: Used a highly optimized `1k` HDRI (`preset="city"`) instead of a massive 4k/8k map, drastically reducing initial bandwidth.

## What I'd Add With More Time
- **Dynamic Lighting Changes**: It would be cool if the environment lighting transitioned (e.g., from bright daylight to a dark neon gamer room) depending on the selected switch or keycap theme.
- **Exploded View Animation**: Adding an interaction that "explodes" the keyboard to show the internal gasket mount, PCB, and foam layers.
- **Custom Texture Upload**: Allowing the user to upload their own image and dynamically map it onto the keycaps.

## Acknowledgements
This project was built during a frontend engineering internship at **FlyRank AI**.
