import React from 'react';
import { motion } from 'motion/react';
import { cn } from './UI';

export const AnimatedBook = ({ className }: { className?: string }) => {
  return (
    <div className={cn("perspective-[1500px] flex items-center justify-center py-20", className)}>
      <motion.div
        className="relative w-64 h-80 preserve-3d"
        initial={{ rotateX: 60, rotateZ: -30 }}
        animate={{
          rotateX: [60, 45, 60],
          rotateZ: [-30, -10, -30],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Back Cover */}
        <div className="absolute inset-0 bg-dark border-4 border-dark rounded-r-lg shadow-[10px_10px_0_0_rgba(119,134,103,0.3)] origin-left [transform:translateZ(-5px)]" />

        {/* Pages (Simulated depth) */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-2 bg-white border-2 border-dark rounded-r-sm origin-left"
            style={{ transform: `translateZ(${i * 2}px)` }}
            animate={{
              rotateY: [0, -160 + (i * 5), 0],
              x: [0, i * 2, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1 + (i * 0.1)
            }}
          />
        ))}

        {/* Front Cover */}
        <motion.div
          className="absolute inset-0 bg-primary border-4 border-dark rounded-r-lg origin-left preserve-3d z-10"
          animate={{
            rotateY: [0, -170, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          {/* Cover Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden">
            <div className="w-full h-full border-2 border-white/30 rounded-md flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-2 bg-white/50 rounded-full" />
              <div className="text-white font-black text-2xl text-center leading-tight">
                CAMPUS<br />BOOK
              </div>
              <div className="w-12 h-1 bg-white/30 rounded-full" />
            </div>
          </div>
          
          {/* Inside of Front Cover */}
          <div className="absolute inset-0 bg-secondary border-4 border-dark rounded-l-lg [transform:rotateY(180deg)] backface-hidden" />
        </motion.div>

        {/* Spine */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-dark border-4 border-dark rounded-l-lg origin-right -translate-x-full rotate-y-90" />
      </motion.div>
    </div>
  );
};
