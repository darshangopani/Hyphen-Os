import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Icosahedron, Torus, Sphere, Trail, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'motion/react';

function HUDLabel({ title, subtitle, color, side = 'right' }: { title: string, subtitle: string, color: string, side?: 'left' | 'right' }) {
  // Map colors to actual tailwind classes to avoid purge issues
  const colorMap: Record<string, { text: string, bg: string, border: string, shadow: string }> = {
    'neon-blue': { text: 'text-neon-blue', bg: 'bg-neon-blue', border: 'border-neon-blue/50', shadow: 'shadow-[0_0_10px_rgba(0,243,255,0.3)]' },
    'neon-purple': { text: 'text-neon-purple', bg: 'bg-neon-purple', border: 'border-neon-purple/50', shadow: 'shadow-[0_0_10px_rgba(188,19,254,0.3)]' },
    'red-500': { text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/50', shadow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]' },
  };

  const styles = colorMap[color] || colorMap['neon-blue'];

  return (
    <Html center distanceFactor={15} zIndexRange={[100, 0]}>
      <div className={`flex items-center gap-2 ${side === 'left' ? 'flex-row-reverse' : 'flex-row'} pointer-events-none`}>
        <div className={`w-12 h-[1px] ${styles.bg} opacity-50`} />
        <div className={`border ${styles.border} bg-black/80 backdrop-blur-md p-2 rounded-sm ${styles.shadow}`}>
          <div className={`${styles.text} font-display font-bold text-[10px] tracking-widest whitespace-nowrap`}>
            {title}
          </div>
          <div className="text-slate-400 font-mono text-[8px] tracking-wider whitespace-nowrap uppercase">
            {subtitle}
          </div>
        </div>
      </div>
    </Html>
  );
}

function CyberGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.getElapsedTime();
    gridRef.current.position.z = (time * 5) % 10;
  });

  return (
    <group position={[0, -10, 0]}>
      <gridHelper ref={gridRef} args={[200, 100, '#ff007f', '#00f3ff']} />
      <gridHelper args={[200, 20, '#bc13fe', '#bc13fe']} position={[0, -0.1, 0]} />
    </group>
  );
}

function DataStreams() {
  const count = 150; // Reduced from 300
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60 - 20
      ),
      speed: Math.random() * 0.5 + 0.1,
      scale: Math.random() * 0.3 + 0.1,
      rotationSpeed: new THREE.Vector3(Math.random() * 0.05, Math.random() * 0.05, Math.random() * 0.05)
    }));
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
      particle.position.z += particle.speed;
      if (particle.position.z > 20) {
        particle.position.z = -60;
      }
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(particle.scale);
      dummy.rotation.x += particle.rotationSpeed.x;
      dummy.rotation.y += particle.rotationSpeed.y;
      dummy.rotation.z += particle.rotationSpeed.z;
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.2, 0.2, 1.5]} />
      <meshBasicMaterial color="#00f3ff" transparent opacity={0.4} wireframe />
    </instancedMesh>
  );
}

function AdvancedCore({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const coreRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const trailsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scroll = scrollYProgress.get();
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.2 + scroll * Math.PI;
      coreRef.current.rotation.x = time * 0.1;
      const scale = 1 + scroll * 0.5;
      coreRef.current.scale.setScalar(scale);
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = time * (0.1 + i * 0.05) + scroll * 2;
        ring.rotation.y = time * (0.2 + i * 0.02);
      });
    }

    if (trailsRef.current) {
      trailsRef.current.rotation.y = time * 0.5;
      trailsRef.current.rotation.z = time * 0.3;
    }
  });

  return (
    <group position={[6, 0, -10]}>
      <Float speed={2} floatIntensity={2} rotationIntensity={1}>
        <group ref={coreRef}>
          {/* Inner Energy Sphere */}
          <Sphere args={[2, 16, 16]}>
            <meshStandardMaterial color="#000000" emissive="#00f3ff" emissiveIntensity={2} wireframe />
          </Sphere>
          
          {/* Core Shell */}
          <Icosahedron args={[2.5, 1]}>
            <meshPhysicalMaterial 
              color="#0a0a0a" 
              metalness={0.8} 
              roughness={0.2} 
              transmission={0.5} 
              transparent 
              opacity={0.8}
              wireframe
            />
          </Icosahedron>
          
          {/* Data Rings */}
          <group ref={ringsRef}>
            <Torus args={[3.5, 0.02, 8, 64]}>
              <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={2} />
            </Torus>
            <Torus args={[4.5, 0.02, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
            </Torus>
            <Torus args={[5.5, 0.02, 8, 64]} rotation={[0, Math.PI / 2, 0]}>
              <meshStandardMaterial color="#bc13fe" emissive="#bc13fe" emissiveIntensity={2} />
            </Torus>
          </group>

          <group position={[0, 7, 0]}>
            <HUDLabel title="HYPHEN_NEXUS" subtitle="QUANTUM_ROUTING_ACTIVE" color="neon-blue" />
          </group>
          <group position={[-6, -4, 0]}>
            <HUDLabel title="DATA_STREAM" subtitle="THROUGHPUT: 99.9%" color="neon-purple" side="left" />
          </group>
        </group>

        {/* Floating Data Nodes around the core */}
        <group ref={trailsRef}>
          {Array.from({ length: 3 }).map((_, i) => (
            <group key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
              <Trail width={1} color={i % 2 === 0 ? "#00f3ff" : "#ff007f"} length={4} decay={1} attenuation={(t) => t * t}>
                <Sphere args={[0.1, 8, 8]} position={[7, 0, 0]}>
                  <meshBasicMaterial color="#ffffff" />
                </Sphere>
              </Trail>
            </group>
          ))}
        </group>
      </Float>
    </group>
  );
}

export function CyberNetwork3D({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetX = (state.mouse.x * 2);
      const targetY = (state.mouse.y * 2);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetX * 0.1, 4, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -targetY * 0.1, 4, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <CyberGrid />
      <DataStreams />
      <AdvancedCore scrollYProgress={scrollYProgress} />
    </group>
  );
}
