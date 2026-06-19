import { forwardRef, type ReactNode, type InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputType = 'text' | 'number' | 'date';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'prefix'> {
  label?: string;
  type?: InputType;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      type = 'text',
      error,
      helperText,
      icon: Icon,
      prefix,
      suffix,
      required,
      disabled,
      placeholder,
      value,
      onChange,
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {required && <span className="text-primary-500 ml-0.5">*</span>}
          </label>
        )}
        <div
          className={cn(
            'relative flex items-center rounded-2xl bg-white/80 border transition-all duration-200',
            error
              ? 'border-red-400 focus-within:ring-4 focus-within:ring-red-100'
              : 'border-gray-200 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100',
            disabled && 'opacity-60 cursor-not-allowed'
          )}
        >
          {prefix && (
            <div className="pl-4 pr-2 text-gray-500 shrink-0">{prefix}</div>
          )}
          {Icon && !prefix && (
            <Icon className="w-5 h-5 ml-4 mr-2 text-gray-400 shrink-0" />
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={cn(
              'w-full px-4 py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400 rounded-2xl',
              'disabled:cursor-not-allowed',
              (Icon || prefix) && 'pl-0',
              suffix && 'pr-0'
            )}
            {...rest}
          />
          {suffix && (
            <div className="pr-4 pl-2 text-gray-500 shrink-0">{suffix}</div>
          )}
        </div>
        {error ? (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-gray-500 text-xs mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
