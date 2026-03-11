import { useScroll, useSpring } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { Routes, Route } from 'react-router-dom';
import { CyberNetwork3D } from './components/CyberNetwork3D';
import { TechOverlay } from './components/TechOverlay';
import { HUDOverlay } from './components/HUDOverlay';
import { Logo } from './components/Logo';
import { TopNav } from './components/TopNav';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';

export default function App() {
  const { scrollYProgress } = useScroll();
  // Smooth out the scroll value for buttery smooth 3D animations
  const smoothScroll = useSpring(scrollYProgress, { damping: 20, stiffness: 100, mass: 0.2 });

  return (
    <div className="relative bg-deep-space text-slate-200 selection:bg-neon-blue/30 selection:text-neon-blue overflow-x-hidden">
      <Logo />
      <TopNav />
      <TechOverlay />
      <HUDOverlay />
      
      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 15], fov: 45 }}
          dpr={[1, 2]} // High DPI support
          gl={{ antialias: false, powerPreference: "high-performance" }} // Disable default AA to use SMAA
        >
          <color attach="background" args={['#010005']} />
          <fog attach="fog" args={['#010005', 10, 50]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ff007f" />
          <directionalLight position={[-10, -20, -10]} intensity={1.5} color="#00f3ff" />
          <pointLight position={[0, 0, 5]} intensity={1} color="#ffffff" />
          
          <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />

          <CyberNetwork3D scrollYProgress={smoothScroll} />
          
          <Environment preset="city" />
          
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.001, 0.001)} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <SMAA />
          </EffectComposer>
        </Canvas>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}
