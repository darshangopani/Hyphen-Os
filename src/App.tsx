import { useScroll, useSpring } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { PlanetOutpost3D } from './components/PlanetOutpost3D';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { AdsterraBox } from './components/AdsterraBox';

export default function App() {
  const { scrollYProgress } = useScroll();
  // Smooth out the scroll value for buttery smooth 3D animations
  const smoothScroll = useSpring(scrollYProgress, { damping: 20, stiffness: 100, mass: 0.2 });

  return (
    <div className="relative bg-deep-space text-slate-200 selection:bg-neon-blue/30 selection:text-neon-blue overflow-x-hidden">
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
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <PlanetOutpost3D scrollYProgress={smoothScroll} />
          
          <Environment preset="city" />
          
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={2} mipmapBlur />
            <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0015, 0.0015)} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <SMAA />
          </EffectComposer>
        </Canvas>
      </div>

      <main className="relative z-10 w-full">
        <Hero />
        
        {/* Ad Placement 1 */}
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <AdsterraBox id="ad-top" width={728} height={90} />
        </div>

        <Features />
        
        {/* Ad Placement 2 */}
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <AdsterraBox id="ad-mid" width={300} height={250} />
        </div>

        <Pricing />
        
        <div className="min-h-[50vh] flex flex-col justify-end">
          <Footer />
        </div>
      </main>
    </div>
  );
}
