const fs = require('fs');
const path = 'c:/Users/sahoo/OneDrive/Desktop/FR-W3-Onwords/week 7/keyboard-configurator/src/components/Keyboard.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import gsap')) {
  code = code.replace('import React', 'import gsap from \'gsap\';\nimport type { ThreeEvent } from \'@react-three/fiber\';\nimport React');
}

const handlers = `
    const playKeySound = useConfiguratorStore((s) => s.playKeySound);

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const mesh = e.object as THREE.Mesh;
      if (mesh.userData.isPressed) return;
      mesh.userData.isPressed = true;
      
      if (mesh.userData.baseY === undefined) {
        mesh.userData.baseY = mesh.position.y;
      }
      
      gsap.killTweensOf(mesh.position);
      gsap.to(mesh.position, {
        y: mesh.userData.baseY - 0.005,
        duration: 0.05,
        ease: 'power2.out',
      });
      playKeySound();
    };

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const mesh = e.object as THREE.Mesh;
      if (!mesh.userData.isPressed) return;
      mesh.userData.isPressed = false;
      
      if (mesh.userData.baseY !== undefined) {
        gsap.killTweensOf(mesh.position);
        gsap.to(mesh.position, {
          y: mesh.userData.baseY,
          duration: 0.15,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };
`;

if (!code.includes('const handlePointerDown')) {
  code = code.replace('return (', handlers + '\n    return (');
}

const meshRegex = /(<mesh\s+ref={keyRefs\.[a-zA-Z0-9_]+}\s+castShadow\s+receiveShadow\s+geometry={[^}]+}\s+material={keycapMat}\s+position={\[[^\]]+\]}\s*)\/>/g;

code = code.replace(meshRegex, (match, p1) => {
  return p1 + 
    '\n              onPointerDown={handlePointerDown}\n' +
    '              onPointerUp={handlePointerUp}\n' +
    '              onPointerOut={(e) => { document.body.style.cursor = \'default\'; handlePointerUp(e); }}\n' +
    '              onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = \'pointer\'; }}\n' +
    '            />';
});

fs.writeFileSync(path, code);
console.log('Done!');
