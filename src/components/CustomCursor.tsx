import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-neon-blue rounded-full pointer-events-none z-[100] mix-blend-screen shadow-[0_0_10px_#00f3ff]"
        animate={{ x: mousePosition.x - 3, y: mousePosition.y - 3 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-neon-blue/50 rounded-full pointer-events-none z-[100] mix-blend-screen flex items-center justify-center"
        animate={{ 
          x: mousePosition.x - 20, 
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
          borderColor: isHovering ? 'rgba(0, 243, 255, 0.8)' : 'rgba(0, 243, 255, 0.3)'
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
      >
        {/* Crosshairs */}
        <div className={`absolute top-0 w-1 h-1 bg-neon-blue transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`} style={{ marginTop: '-2px' }} />
        <div className={`absolute bottom-0 w-1 h-1 bg-neon-blue transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`} style={{ marginBottom: '-2px' }} />
        <div className={`absolute left-0 w-1 h-1 bg-neon-blue transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`} style={{ marginLeft: '-2px' }} />
        <div className={`absolute right-0 w-1 h-1 bg-neon-blue transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`} style={{ marginRight: '-2px' }} />
      </motion.div>
    </>
  );
}
