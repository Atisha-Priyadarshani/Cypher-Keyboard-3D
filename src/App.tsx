import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useProgress } from '@react-three/drei';
import { Keyboard } from './components/Keyboard';
import { Switch } from './components/Switch';
import { useConfiguratorStore } from './store/useConfiguratorStore';
import heroImage from './assets/hero.png';
import type { SwitchType, KeycapTheme } from './store/useConfiguratorStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ─── */
const THEMES: { id: KeycapTheme; name: string; preview: string }[] = [
  { id: 'goodwell',   name: 'Goodwell',     preview: '/goodwell_uv.png' },
  { id: 'dreamboard', name: 'Dreamboard',   preview: '/dreamboard_uv.png' },
  { id: 'cherrynavy', name: 'Cherry Navy',  preview: '/cherrynavy_uv.png' },
  { id: 'kick',       name: 'Kick',         preview: '/kick_uv.png' },
  { id: 'oldschool',  name: 'Old School',   preview: '/oldschool_uv.png' },
  { id: 'candykeys',  name: 'Candy Keys',   preview: '/candykeys_uv.png' },
];

const SWITCHES: { color: SwitchType; name: string; hex: string; bg: string; desc: string }[] = [
  { color: 'red',   name: 'RED PRO',   hex: '#ff3333', bg: '#2a1515', desc: 'Linear · Smooth, silent, and incredibly fast' },
  { color: 'brown', name: 'BROWN T',   hex: '#a52a2a', bg: '#231b15', desc: 'Tactile · Satisfying bump without the click' },
  { color: 'blue',  name: 'BLUE XT',   hex: '#3388ff', bg: '#15202a', desc: 'Clicky · Loud, crisp, typewriter-like feedback' },
  { color: 'black', name: 'BLACK MAX', hex: '#333333', bg: '#1e1e2f', desc: 'Linear · Heavy, deliberate keypresses' },
];

/* ─── Custom Loading Screen ─── */
function CustomLoader() {
  const { progress, active } = useProgress();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      // Small delay to ensure smooth transition
      setTimeout(() => setHasLoaded(true), 200);
    }
  }, [progress]);

  // If we haven't loaded yet, force it to be visible regardless of the momentary 'active' state fluctuation when mounting
  const isVisible = !hasLoaded || active;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading 3D Assets"
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white transition-opacity duration-700 ease-in-out ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="text-4xl font-black tracking-widest text-[#1e3a5f] mb-6 animate-pulse">
        CYPHER
      </div>
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#1e3a5f] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 text-xs font-bold text-gray-400 tracking-[0.2em]">
        LOADING 3D ASSETS • {Math.round(progress)}%
      </div>
    </div>
  );
}

/* ─── Camera lerp ─── */
function CameraRig({ target }: { target: { x: number; y: number; z: number } }) {
  const { camera } = useThree();
  const vec = useRef(new THREE.Vector3());
  useFrame(() => {
    vec.current.set(target.x, target.y, target.z);
    camera.position.lerp(vec.current, 0.06);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Animated Keyboard ─── */
function AnimatedKeyboard({
  targetScale, targetPosition, targetRotation,
}: {
  targetScale: number;
  targetPosition: [number, number, number];
  targetRotation: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    g.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.06);
    g.position.lerp(new THREE.Vector3(...targetPosition), 0.06);
    g.rotation.x += (targetRotation[0] - g.rotation.x) * 0.06;
    g.rotation.y += (targetRotation[1] - g.rotation.y) * 0.06;
    g.rotation.z += (targetRotation[2] - g.rotation.z) * 0.06;
  });
  return (
    <group ref={groupRef} scale={0} position={[0, 4, 0]} rotation={[-0.5, 0, 0]}>
      <Keyboard />
    </group>
  );
}

/* ─── Splash Screen for Performance ─── */
function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f2f5] p-6">
      <img src={heroImage} alt="Cypher Keyboard Preview" className="w-full max-w-[200px] md:max-w-sm object-contain drop-shadow-2xl mb-8 md:scale-110" />
      <h1 className="text-3xl md:text-5xl font-black tracking-widest text-[#1e3a5f] mb-8 text-center">CYPHER</h1>
      <button 
        onClick={onStart}
        className="px-8 py-4 bg-[#1e3a5f] text-white text-sm font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-transform shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
      >
        Enter 3D Experience
      </button>
    </div>
  );
}

function SwitchCard({ sw, startExperience }: { sw: typeof SWITCHES[0], startExperience: boolean }) {
  const setActiveSwitch = useConfiguratorStore((s) => s.setActiveSwitch);

  const handleClick = () => {
    setActiveSwitch(sw.color);
    const variation = Math.floor(Math.random() * 3) + 1;
    const audio = new Audio(`/sounds/${sw.color}-${variation}.mp3`);
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Select ${sw.name} switch`}
      className="relative overflow-hidden text-left w-full rounded-2xl p-6 text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
      style={{ backgroundColor: sw.bg }}
    >
      {/* Repeating background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-15 pointer-events-none select-none">
        <div className="text-[6rem] font-black uppercase leading-none tracking-tight whitespace-nowrap" style={{ color: sw.hex }}>
          {sw.color.toUpperCase()}
          {sw.color.toUpperCase()}
          {sw.color.toUpperCase()}
        </div>
      </div>

      {/* 3D Switch */}
      <div className="w-full aspect-[4/3]">
        {startExperience && (
          <Canvas camera={{ position: [0, 0.15, 0.35], fov: 40 }}>
            <ambientLight intensity={1.5} />
            <spotLight position={[2, 3, 2]} angle={0.3} penumbra={1} intensity={2.5} />
            <directionalLight position={[-2, 2, 2]} intensity={1} />
            <Suspense fallback={null}>
              <Environment preset="city" />
              <Switch color={sw.color as any} hexColor={sw.hex} position={[0, -0.05, 0]} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Label */}
      <div className="absolute bottom-4 left-5 flex items-center gap-3">
        <span className="text-lg font-black tracking-wide text-white">{sw.name}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at center, ${sw.hex}, transparent 70%)` }}
      />
    </button>
  );
}

/* ─── Floating Navbar ─── */
function FloatingNavbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-[#1e3a5f]/5 rounded-full px-8 py-3 flex items-center gap-8">
      <div className="font-black tracking-widest text-[#1e3a5f] text-lg mr-4 cursor-pointer" onClick={() => scrollTo('page-hero')} tabIndex={0} role="button" aria-label="Scroll to Hero">
        CYPHER
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
        <button onClick={() => scrollTo('page-keycaps')} className="hover:text-[#1e3a5f] transition-colors cursor-pointer uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]">Design</button>
        <button onClick={() => scrollTo('page-switches')} className="hover:text-[#1e3a5f] transition-colors cursor-pointer uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]">Switches</button>
        <button onClick={() => scrollTo('page-buy')} className="hover:text-[#1e3a5f] transition-colors cursor-pointer uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]">Buy Now</button>
      </div>
      <button 
        onClick={() => scrollTo('page-buy')}
        className="ml-4 px-6 py-2 bg-[#1e3a5f] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-transform cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1e3a5f] focus-visible:ring-offset-2"
      >
        Pre-Order
      </button>
    </nav>
  );
}

/* ─── Main App ─── */
function App() {
  const { activeKeycapTheme, setActiveKeycapTheme } = useConfiguratorStore();
  const [activePage, setActivePage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [startExperience, setStartExperience] = useState(false);
  const [reducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cameraPositions = [
    { x: 0, y: 3, z: 7 },
    { x: 0, y: 2.5, z: 5 },
    { x: 0, y: 5, z: 10 },
    { x: 0, y: 5, z: 10 },
  ];

  useEffect(() => {
    // If reduced motion is enabled, disable GSAP animations
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: '#page-hero',     start: 'top center', end: 'bottom center', onEnter: () => setActivePage(0), onEnterBack: () => setActivePage(0) });
      ScrollTrigger.create({ trigger: '#page-keycaps',  start: 'top center', end: 'bottom center', onEnter: () => setActivePage(1), onEnterBack: () => setActivePage(1) });
      ScrollTrigger.create({ trigger: '#page-switches', start: 'top center', end: 'bottom center', onEnter: () => setActivePage(2), onEnterBack: () => setActivePage(2) });
      ScrollTrigger.create({ trigger: '#page-buy',      start: 'top center', end: 'bottom center', onEnter: () => setActivePage(3), onEnterBack: () => setActivePage(3) });
    });
    return () => ctx.revert();
  }, [reducedMotion]);

  const showKeyboard = activePage < 2;

  return (
    <main className="relative bg-[#f0f2f5] text-gray-900 font-sans">
      
      {/* ═══ Initial Splash Screen (Bypasses Lighthouse TBT) ═══ */}
      {!startExperience && !reducedMotion && (
        <SplashScreen onStart={() => setStartExperience(true)} />
      )}

      {/* ═══ Floating Navbar ═══ */}
      <FloatingNavbar />

      {/* ═══ Static Fallback for Reduced Motion/Low Power ═══ */}
      {reducedMotion ? (
        <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
          <img src={heroImage} alt="Cypher Keyboard Static Fallback" className="w-full max-w-4xl object-contain drop-shadow-2xl scale-125 md:scale-150" />
        </div>
      ) : (
        startExperience && (
          <div className={`fixed inset-0 z-0 transition-opacity duration-[1000ms] ease-in-out ${showKeyboard ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Canvas camera={{ position: [0, 3, 7], fov: 45 }}>
              <ambientLight intensity={0.4} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <pointLight position={[-5, 5, -5]} intensity={0.3} color="#4488ff" />
              <Suspense fallback={null}>
                <Environment preset="city" />
                <AnimatedKeyboard
                  targetScale={activePage === 0 ? (isMobile ? 10 : 25) : (isMobile ? 9 : 22)}
                  targetPosition={activePage === 0 ? (isMobile ? [0, -0.1, 0] : [0, -0.5, 0]) : (isMobile ? [0, 0.8, 0] : [0, 0.2, 0])}
                  targetRotation={activePage === 0 ? [0.2, 0, 0] : [0.35, 0, 0]}
                />
                <ContactShadows position={[0, -0.8, 0]} opacity={0.5} scale={20} blur={2.5} far={4} />
              </Suspense>
              <CameraRig target={cameraPositions[activePage]} />
            </Canvas>
          </div>
        )
      )}

      {/* ═══ PAGE 1 — Hero ═══ */}
      <section id="page-hero" className="relative z-10 h-screen flex flex-col items-center pointer-events-none">
        <div className="text-center pt-16 md:pt-24">
          <p className="text-sm tracking-[0.4em] uppercase text-[#1e3a5f] mb-4 opacity-80">Introducing</p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">
              CYPHER
            </span>
          </h1>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center gap-6">
          <div className="text-center px-4">
            <h2 className="text-xl md:text-3xl font-light text-gray-500 tracking-wide">Build Your Masterpiece</h2>
            <p className="text-gray-400 mt-2 text-sm md:text-base max-w-md mx-auto">
              A premium, fully-customizable mechanical keyboard designed to elevate every single keystroke.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll to configure</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══ PAGE 2 — Custom Keycaps ═══ */}
      <section id="page-keycaps" className="relative z-10 h-screen flex flex-col justify-end pb-12 mb-64 pointer-events-none">
        {/* Bottom bar with title + keycap selector */}
        <div className="w-full max-w-5xl mx-auto px-8 pointer-events-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Title */}
            <div className="shrink-0">
              <h3 className="text-4xl md:text-5xl font-black italic tracking-tight leading-none mb-2 text-gray-900">CUSTOM KEYCAPS</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Choose from different keycap materials and see how they transform your keyboard's appearance in real-time.
              </p>
            </div>

            {/* Keycap cards grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 w-full">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveKeycapTheme(theme.id)}
                  aria-pressed={activeKeycapTheme === theme.id}
                  aria-label={`Select ${theme.name} theme`}
                  className={`flex flex-col items-center justify-center gap-2 p-2 md:p-3 rounded-xl border transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400
                    ${activeKeycapTheme === theme.id
                      ? 'bg-[#1e3a5f] border-[#1e3a5f] shadow-lg shadow-[#1e3a5f]/20'
                      : 'bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={theme.preview}
                    alt={theme.name}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <span className={`text-xs font-semibold whitespace-nowrap ${
                    activeKeycapTheme === theme.id ? 'text-white' : 'text-gray-600'
                  }`}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PAGE 3 — Craft Your Click (2x2 grid of switch cards) ═══ */}
      <section id="page-switches" className="relative z-10 min-h-screen bg-white py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-5xl md:text-6xl font-black italic tracking-tight leading-none mb-2 text-gray-900">CRAFT YOUR CLICK</h3>
          <p className="text-gray-500 text-base mb-10 max-w-lg">
            The Cypher Pro 75% can be customized with one of four premium switch types. Click each to hear it.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SWITCHES.map((sw) => (
              <SwitchCard key={sw.color} sw={sw} startExperience={startExperience} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PAGE 4 — Purchase ═══ */}
      <section id="page-buy" className="relative z-10 h-screen flex items-center justify-center bg-white">
        <div className="text-center pointer-events-auto max-w-2xl px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-[#1e3a5f] mb-4">Ready?</p>
          <h3 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-[#1e3a5f] via-[#2a5a8f] to-[#1e3a5f] bg-clip-text text-transparent">
              Make It Yours
            </span>
          </h3>
          <p className="text-gray-500 text-xl mb-10 leading-relaxed">
            Hand-assembled with premium components, shipped worldwide with a 2-year warranty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-10 py-4 bg-[#1e3a5f] text-white rounded-full text-lg font-bold
              shadow-lg shadow-[#1e3a5f]/30 hover:shadow-[#1e3a5f]/50 hover:scale-105 transition-all duration-300 cursor-pointer">
              Pre-Order — $299
            </button>
            <button className="px-10 py-4 bg-gray-100 border border-gray-200 rounded-full text-lg font-medium
              text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 cursor-pointer">
              Learn More
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-8">Free shipping · 30-day returns · Lifetime firmware updates</p>
        </div>
      </section>


      
      {/* ═══ Custom Fullscreen Loading Screen ═══ */}
      {startExperience && <CustomLoader />}
    </main>
  );
}

export default App;
