import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

type ModalMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  maxWidth?: ModalMaxWidth;
  showClose?: boolean;
}

const maxWidthStyles: Record<ModalMaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={backdropVariants}
            className="absolute inset-0 backdrop-blur-md bg-black/40"
            onClick={onClose}
          />
          <motion.div
            variants={modalVariants}
            className={cn(
              'relative w-full rounded-3xl glass-card shadow-soft-xl',
              maxWidthStyles[maxWidth]
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                {title ? (
                  <h2 className="text-xl font-display font-semibold text-gray-800">
                    {title}
                  </h2>
                ) : (
                  <div />
                )}
                {showClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    leftIcon={<X className="w-4 h-4" />}
                    aria-label="关闭"
                  />
                )}
              </div>
            )}
            <div className={cn('px-6 pb-6', !title && !showClose && 'pt-6')}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
