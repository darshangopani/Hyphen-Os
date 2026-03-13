import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'motion/react';

function HUDLabel({ title, subtitle, color, side = 'right' }: { title: string, subtitle: string, color: string, side?: 'left' | 'right' }) {
  const colorMap: Record<string, { text: string, bg: string, border: string, shadow: string }> = {
    'brand-primary': { text: 'text-brand-primary', bg: 'bg-brand-primary', border: 'border-brand-primary/50', shadow: 'shadow-[0_0_10px_rgba(249,115,22,0.3)]' },
    'brand-secondary': { text: 'text-brand-secondary', bg: 'bg-brand-secondary', border: 'border-brand-secondary/50', shadow: 'shadow-[0_0_10px_rgba(244,63,94,0.3)]' },
    'red-500': { text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/50', shadow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]' },
  };

  const styles = colorMap[color] || colorMap['brand-primary'];

  return (
    <Html center distanceFactor={15} zIndexRange={[100, 0]}>
      <div className={`flex items-center gap-2 ${side === 'left' ? 'flex-row-reverse' : 'flex-row'} pointer-events-none`}>
        <div className={`w-12 h-[1px] ${styles.bg} opacity-50`} />
        <div className={`border ${styles.border} bg-black/80 backdrop-blur-md p-2 rounded-sm ${styles.shadow}`}>
          <div className={`${styles.text} font-display font-bold text-[10px] tracking-widest whitespace-nowrap`}>
            {title}
          </div>
          <div className="text-zinc-400 font-mono text-[8px] tracking-wider whitespace-nowrap uppercase">
            {subtitle}
          </div>
        </div>
      </div>
    </Html>
  );
}

function NeonGalaxy({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const count = 10000; // Optimized particle count for smoother performance
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorInner = new THREE.Color('#ffffff'); // White hot core
    const colorMid = new THREE.Color('#f97316');   // Vibrant Orange
    const colorOuter = new THREE.Color('#f43f5e'); // Warm Rose
    const colorEdge = new THREE.Color('#14b8a6');  // Teal Accent

    for (let i = 0; i < count; i++) {
      // Galaxy spiral math
      const radius = Math.random() * 25;
      const spinAngle = radius * 0.4; // Tightness of the spiral
      const branchAngle = ((i % 4) * Math.PI * 2) / 4; // 4 spiral arms
      
      // Random scattering to make it look organic, tighter in the center
      const scatter = Math.pow(Math.random(), 2) * (25 - radius) * 0.15;
      const randomX = Math.cos(Math.random() * Math.PI * 2) * scatter;
      const randomY = (Math.random() - 0.5) * (scatter * 0.5); // Flatter on Y axis
      const randomZ = Math.sin(Math.random() * Math.PI * 2) * scatter;

      positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color gradient based on distance from center
      const mixedColor = new THREE.Color();
      if (radius < 3) {
        mixedColor.lerpColors(colorInner, colorMid, radius / 3);
      } else if (radius < 12) {
        mixedColor.lerpColors(colorMid, colorOuter, (radius - 3) / 9);
      } else {
        mixedColor.lerpColors(colorOuter, colorEdge, (radius - 12) / 13);
      }
      
      // Add brightness variation
      const brightness = Math.random() * 0.5 + 0.5;
      colors[i * 3] = mixedColor.r * brightness;
      colors[i * 3 + 1] = mixedColor.g * brightness;
      colors[i * 3 + 2] = mixedColor.b * brightness;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scroll = scrollYProgress.get();
    
    if (groupRef.current) {
      // Smooth, majestic rotation
      groupRef.current.rotation.y = time * 0.05 + scroll * Math.PI;
      groupRef.current.rotation.x = Math.PI / 5 + scroll * 0.5; // Tilted to show the spiral
      groupRef.current.rotation.z = time * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[5, -2, -20]}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.15} 
          vertexColors 
          transparent 
          opacity={0.9} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Core Supermassive Glow */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <group position={[0, 10, 0]}>
        <HUDLabel title="NEURAL_GALAXY" subtitle="10,000_DATA_POINTS" color="brand-primary" />
      </group>
      <group position={[-12, -4, 0]}>
        <HUDLabel title="CORE_DENSITY" subtitle="CRITICAL_MASS" color="red-500" side="left" />
      </group>
    </group>
  );
}

export function CyberNetwork3D({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle parallax effect based on mouse position
      const targetX = (state.mouse.x * 0.5);
      const targetY = (state.mouse.y * 0.5);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetX * 0.05, 2, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -targetY * 0.05, 2, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <NeonGalaxy scrollYProgress={scrollYProgress} />
      
      {/* Deep Space Starfield */}
      <Sparkles count={1000} scale={100} size={1} speed={0.1} opacity={0.4} color="#ffffff" />
      <Sparkles count={500} scale={80} size={2} speed={0.2} opacity={0.3} color="#f97316" />
    </group>
  );
}
