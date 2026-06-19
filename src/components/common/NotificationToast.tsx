import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}

const toastConfig: Record<
  ToastType,
  { color: string; bg: string; Icon: typeof Info }
> = {
  info: {
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    Icon: Info,
  },
  success: {
    color: 'text-green-500',
    bg: 'bg-green-500',
    Icon: CheckCircle,
  },
  warning: {
    color: 'text-amber-500',
    bg: 'bg-amber-500',
    Icon: AlertTriangle,
  },
  error: {
    color: 'text-red-500',
    bg: 'bg-red-500',
    Icon: XCircle,
  },
};

function Toast({
  id,
  title,
  message,
  type = 'info',
  onClose,
  duration = 4000,
}: ToastProps) {
  const { color, bg, Icon } = toastConfig[type];

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 260 }}
      className="relative w-80 overflow-hidden rounded-2xl glass-card shadow-soft-lg animate-fade-in-up"
    >
      <div className={cn('absolute left-0 top-0 bottom-0 w-1.5', bg)} />
      <div className="flex items-start gap-3 p-4 pl-5">
        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', color)} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm leading-tight">
            {title}
          </p>
          {message && (
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">
              {message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onClose(id)}
          className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors"
          aria-label="关闭通知"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Toast;
