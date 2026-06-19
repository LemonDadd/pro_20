import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-primary text-white shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-white/80 text-gray-700 glass-card hover:bg-white shadow-soft',
  ghost:
    'bg-transparent text-gray-700 hover:bg-black/5',
  outline:
    'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-soft',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-7 py-3.5 text-lg gap-2.5',
  xl: 'px-9 py-4.5 text-xl gap-3',
};

type MotionButtonProps = ButtonProps & MotionProps;

const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth,
      disabled,
      leftIcon,
      rightIcon,
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? undefined : {}}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...rest}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children && <span className="whitespace-nowrap">{children}</span>}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
