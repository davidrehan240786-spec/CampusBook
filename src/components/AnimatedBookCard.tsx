// coderabbit full review trigger
import React from 'react';
import { motion } from 'motion/react';
import { Book, Star, ArrowRight, Sparkles, Award } from 'lucide-react';
import { cn } from './UI';

interface AnimatedBookCardProps {
  className?: string;
}

export const AnimatedBookCard = ({ className }: AnimatedBookCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      whileHover={{ y: -10, rotate: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "bg-secondary border-2 border-dark rounded-[60px] p-10 shadow-[12px_12px_0_0_rgba(25,26,35,1)] relative overflow-hidden",
        className
      )}
    >
      {/* Decorative background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
      />

      {/* Floating "Cool" Elements */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 15, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-20 text-primary/30 z-0"
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 left-10 text-primary/20 z-0"
      >
        <Book size={48} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white border-2 border-dark rounded-[40px] p-8 flex flex-col gap-6 relative z-10"
      >
        <div className="flex justify-between items-start">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-16 h-16 bg-primary border-2 border-dark rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0_0_rgba(25,26,35,1)]"
          >
            <Book size={32} />
          </motion.div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1 text-primary">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <Star size={20} fill="currentColor" />
                </motion.div>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-1 text-xs font-bold text-primary bg-secondary/50 px-2 py-1 rounded-full border border-primary/20"
            >
              <Award size={12} />
              <span>Top Marketplace Seller</span>
            </motion.div>
          </div>
        </div>

        <div className="space-y-1">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl font-black text-dark leading-tight"
          >
            Advanced Calculus
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-zinc-500 font-bold"
          >
            by Dr. Michael Spivak
          </motion.p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Price</span>
            <span className="text-2xl md:text-3xl font-black text-dark">₹25.00</span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-dark border-2 border-dark rounded-full flex items-center justify-center text-white shadow-[4px_4px_0_0_rgba(119,134,103,1)]"
          >
            <ArrowRight size={28} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
