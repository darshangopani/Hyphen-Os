import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Html, Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'motion/react';

// --- HUD Label Component ---
function HUDLabel({ title, subtitle, color, side = 'right' }: { title: string, subtitle: string, color: string, side?: 'left' | 'right' }) {
  return (
    <Html center distanceFactor={15} zIndexRange={[100, 0]}>
      <div className={`flex items-center gap-2 ${side === 'left' ? 'flex-row-reverse' : 'flex-row'} pointer-events-none`}>
        {/* Connecting Line */}
        <div className={`w-12 h-[1px] bg-${color} opacity-50`} />
        {/* Label Box */}
        <div className={`border border-${color}/50 bg-black/80 backdrop-blur-md p-2 rounded-sm shadow-[0_0_10px_rgba(var(--color-${color}),0.3)]`}>
          <div className={`text-${color} font-display font-bold text-[10px] tracking-widest whitespace-nowrap`}>
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

// --- Orbiting Moon Component ---
function OrbitingMoon({ 
  radius, 
  speed, 
  size, 
  color, 
  name, 
  desc, 
  startAngle = 0,
  scrollYProgress
}: { 
  radius: number, speed: number, size: number, color: string, name: string, desc: string, startAngle?: number, scrollYProgress: MotionValue<number>
}) {
  const groupRef = useRef<THREE.Group>(null);
  const angleRef = useRef(startAngle);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Speed increases slightly as we scroll down
    const scroll = scrollYProgress.get();
    const currentSpeed = speed * (1 + scroll * 2);
    
    angleRef.current += currentSpeed * delta;
    const x = Math.cos(angleRef.current) * radius;
    const z = Math.sin(angleRef.current) * radius;
    
    groupRef.current.position.set(x, Math.sin(angleRef.current * 2) * 1.5, z);
    groupRef.current.rotation.y += delta;
    groupRef.current.rotation.x += delta * 0.5;
  });

  return (
    <group ref={groupRef}>
      <Icosahedron args={[size, 4]}>
        <meshPhysicalMaterial color="#222" metalness={0.9} roughness={0.4} clearcoat={1} clearcoatRoughness={0.1} />
      </Icosahedron>
      {/* Glowing core of the moon */}
      <Sphere args={[size * 0.8, 32, 32]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Sphere>
      <HUDLabel title={name} subtitle={desc} color={color.replace('neon-', '').replace('terminal-', '')} side={radius % 2 === 0 ? 'left' : 'right'} />
    </group>
  );
}

// --- Fragmented Dyson Shell (Layer 1) ---
function ShellLayer({ 
  scrollYProgress, 
  count, 
  baseRadius, 
  color, 
  emissive, 
  rotationSpeed, 
  reverse,
  emissiveIntensity = 1.5,
  metalness = 0.8,
  roughness = 0.2,
  clearcoat = 1
}: { 
  scrollYProgress: MotionValue<number>;
  count: number;
  baseRadius: number;
  color: string;
  emissive: string;
  rotationSpeed: number;
  reverse: boolean;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
  clearcoat?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Generate points on a sphere using Fibonacci lattice
  const { positions, normals } = useMemo(() => {
    const pos = [];
    const norm = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      
      const vector = new THREE.Vector3(x, y, z);
      norm.push(vector.clone().normalize());
      pos.push(vector.multiplyScalar(baseRadius));
    }
    return { positions: pos, normals: norm };
  }, [count, baseRadius]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scroll = scrollYProgress.get();
    
    // Dismantle logic: starts dismantling immediately, fully dismantled by scroll 0.4
    const dismantleProgress = Math.min(1, Math.max(0, scroll / 0.4));
    // Easing function for explosive dismantle
    const ease = 1 - Math.pow(1 - dismantleProgress, 3);

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const p = positions[i];
      const n = normals[i];
      
      // Distance to push outward
      const pushDistance = ease * 15 + (Math.sin(time * 2 + i) * 0.2);
      
      dummy.position.copy(p).add(n.clone().multiplyScalar(pushDistance));
      
      // Rotate fragments chaotically as they explode
      dummy.rotation.set(
        n.x + time * ease * (i % 3 === 0 ? 1 : -1),
        n.y + time * ease,
        n.z
      );
      
      // Shrink fragments as they fly away
      const scale = Math.max(0, 1 - ease * 1.2);
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Rotate the entire shell slowly
    const dir = reverse ? -1 : 1;
    meshRef.current.rotation.y = time * rotationSpeed * dir;
    meshRef.current.rotation.z = time * (rotationSpeed * 0.4) * dir;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Hexagonal plates */}
      <cylinderGeometry args={[0.4, 0.4, 0.05, 6]} />
      <meshPhysicalMaterial 
        color={color} 
        metalness={metalness} 
        roughness={roughness} 
        clearcoat={clearcoat} 
        clearcoatRoughness={0.1} 
        emissive={emissive} 
        emissiveIntensity={emissiveIntensity} 
      />
    </instancedMesh>
  );
}

function FragmentedShell({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <group>
      {/* Vibrant Neon Shell */}
      <ShellLayer 
        scrollYProgress={scrollYProgress} 
        count={500} 
        baseRadius={5} 
        color="#00f3ff" 
        emissive="#00f3ff" 
        rotationSpeed={0.05} 
        reverse={false} 
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
      />
      
      {/* Shell Label - fades out as it dismantles */}
      <group position={[6.5, 2, 0]}>
        <HUDLabel title="DEFENSE_SHELL" subtitle="STATUS: DISMANTLING" color="neon-blue" />
      </group>
    </group>
  );
}

// --- Sub-Orbit Machinery (Layer 2) ---
function SubOrbitMachinery({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    // Dismantles between 0.3 and 0.7
    const dismantleProgress = Math.min(1, Math.max(0, (scroll - 0.3) / 0.4));
    const ease = Math.pow(dismantleProgress, 2);

    if (groupRef.current) {
      // Scale up and fade out
      const scale = 1 + ease * 3;
      groupRef.current.scale.setScalar(scale);
      
      // Spin wildly as it breaks down
      groupRef.current.rotation.x = state.clock.getElapsedTime() * (0.2 + ease * 2);
      groupRef.current.rotation.y = state.clock.getElapsedTime() * (0.3 + ease * 2);
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        (ring as THREE.Mesh).rotation.x += 0.01 * (i + 1) * (1 + ease * 5);
        (ring as THREE.Mesh).rotation.y += 0.02 * (i + 1) * (1 + ease * 5);
        // Fade out material
        const mat = (ring as THREE.Mesh).material as THREE.MeshStandardMaterial;
        mat.opacity = 1 - ease;
        mat.transparent = true;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[3.8, 64, 64]}>
        <meshPhysicalMaterial 
          color="#2a0080" 
          metalness={0.5} 
          roughness={0.1} 
          transmission={0.9} 
          thickness={0.5} 
          ior={1.5} 
          transparent 
          opacity={1} 
          emissive="#ff007f"
          emissiveIntensity={0.4}
        />
      </Sphere>
      
      <group ref={ringsRef}>
        <Torus args={[4.2, 0.05, 64, 100]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={0.8} />
        </Torus>
        <Torus args={[4.5, 0.02, 64, 100]} rotation={[0, Math.PI/4, 0]}>
          <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.6} />
        </Torus>
        <Torus args={[4.8, 0.08, 64, 100]} rotation={[0, 0, Math.PI/3]}>
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.4} wireframe />
        </Torus>
      </group>

      <group position={[-4.5, -2, 0]}>
        <HUDLabel title="SUB_ORBITAL_MACHINERY" subtitle="PROCESSING_UNIT_V2" color="neon-purple" side="left" />
      </group>
    </group>
  );
}

// --- Quantum Core (Layer 3) ---
function QuantumCore({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const scroll = scrollYProgress.get();
    // Core becomes fully active after 0.6
    const activation = Math.min(1, Math.max(0, (scroll - 0.6) / 0.4));
    
    const time = state.clock.getElapsedTime();

    if (coreRef.current) {
      // Pulse and spin
      const pulse = Math.sin(time * (5 + activation * 10)) * 0.1;
      coreRef.current.scale.setScalar(1 + pulse + activation * 0.5);
      coreRef.current.rotation.y = time * (0.5 + activation * 2);
      coreRef.current.rotation.z = time * 0.2;
      
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8 + activation * 3;
    }

    if (auraRef.current) {
      auraRef.current.scale.setScalar(1.2 + Math.sin(time * 2) * 0.1 + activation * 0.8);
      auraRef.current.rotation.x = time;
      auraRef.current.rotation.y = time * 1.5;
    }
  });

  return (
    <group>
      {/* Solid Inner Core */}
      <Icosahedron ref={coreRef} args={[2.5, 4]}>
        <meshPhysicalMaterial color="#ffffff" emissive="#ffaa00" emissiveIntensity={1.5} clearcoat={1} clearcoatRoughness={0.1} wireframe={false} />
      </Icosahedron>
      
      {/* Wireframe Aura */}
      <Icosahedron ref={auraRef} args={[2.8, 3]}>
        <meshStandardMaterial color="#ff007f" emissive="#ff007f" emissiveIntensity={1.5} wireframe={true} transparent opacity={0.5} />
      </Icosahedron>

      <group position={[0, 3.5, 0]}>
        <HUDLabel title="HYPHEN_QUANTUM_CORE" subtitle="ENERGY_YIELD: MAXIMUM" color="red-500" />
      </group>
    </group>
  );
}

// --- Main Planet Outpost Component ---
export function PlanetOutpost3D({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating animation for the entire outpost
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
      
      // Parallax effect based on mouse with damping for smoothness
      const targetX = (state.mouse.x * 2);
      const targetY = (state.mouse.y * 2);
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetX * 0.1, 4, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, -targetY * 0.1, 4, delta);
    }
  });

  return (
    <group ref={groupRef} position={[6, 0, -5]}> {/* Positioned to the right */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* Layer 3: The Core */}
        <QuantumCore scrollYProgress={scrollYProgress} />
        
        {/* Layer 2: Sub-Orbit Machinery */}
        <SubOrbitMachinery scrollYProgress={scrollYProgress} />
        
        {/* Layer 1: Fragmented Shell */}
        <FragmentedShell scrollYProgress={scrollYProgress} />

        {/* Orbiting Moons / Satellites */}
        <OrbitingMoon 
          radius={8} 
          speed={0.2} 
          size={0.5} 
          color="#00f3ff" 
          name="DEFENSE_SAT_ALPHA" 
          desc="ORBITAL_MONITORING" 
          startAngle={0} 
          scrollYProgress={scrollYProgress} 
        />
        <OrbitingMoon 
          radius={11} 
          speed={0.15} 
          size={0.8} 
          color="#bc13fe" 
          name="COMMS_RELAY_OMEGA" 
          desc="INTERSTELLAR_UPLINK" 
          startAngle={Math.PI} 
          scrollYProgress={scrollYProgress} 
        />
        <OrbitingMoon 
          radius={14} 
          speed={0.1} 
          size={1.2} 
          color="#ff003c" 
          name="ESCROW_VAULT_NODE" 
          desc="SECURE_STORAGE" 
          startAngle={Math.PI / 2} 
          scrollYProgress={scrollYProgress} 
        />

      </Float>
    </group>
  );
}
