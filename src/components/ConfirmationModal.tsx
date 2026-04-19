// coderabbit full review trigger
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, cn } from './UI';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'secondary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white border-4 border-dark rounded-[40px] shadow-[15px_15px_0_0_#191A23] p-8 md:p-10 overflow-hidden"
          >
            {/* Header Icon */}
            <div className={cn(
              "w-16 h-16 rounded-2xl border-2 border-dark flex items-center justify-center mb-8 shadow-[4px_4px_0_0_#191A23]",
              variant === 'danger' ? "bg-red-100 text-red-600" : "bg-primary text-white"
            )}>
              <AlertCircle size={32} />
            </div>

            <button 
              onClick={onCancel}
              className="absolute top-8 right-8 text-zinc-400 hover:text-dark transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl md:text-3xl font-black text-dark mb-4 leading-tight">
              {title}
            </h3>
            
            <p className="text-zinc-500 font-bold mb-10 leading-relaxed">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="flex-1 h-14 rounded-2xl border-2 border-dark font-black hover:bg-zinc-100"
              >
                {cancelLabel}
              </Button>
              <Button 
                onClick={onConfirm}
                className={cn(
                  "flex-1 h-14 rounded-2xl border-2 border-dark font-black shadow-[4px_4px_0_0_#191A23] active:translate-y-[2px] active:shadow-none",
                  variant === 'danger' ? "bg-red-500 text-white hover:bg-red-600" : variant === 'secondary' ? "bg-secondary text-dark hover:bg-secondary/90" : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                {confirmLabel}
              </Button>
            </div>
            
            {/* Decorative dot background pattern */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[radial-gradient(#191A23_2px,transparent_2px)] [background-size:16px_16px] opacity-5 -z-10"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
