import { cn } from '@/lib/utils';

type ToggleSize = 'sm' | 'md';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: ToggleSize;
}

const sizeConfig: Record<ToggleSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'w-9 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-12 h-7',
    thumb: 'w-5.5 h-5.5',
    translate: 'translate-x-5',
  },
};

export default function Toggle({
  checked,
  onChange,
  label,
  disabled,
  size = 'md',
}: ToggleProps) {
  const config = sizeConfig[size];

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer'
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-300 ease-in-out',
          config.track,
          checked ? 'bg-gradient-primary' : 'bg-gray-200',
          disabled && 'cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-block rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out',
            config.thumb,
            checked ? config.translate : 'translate-x-0.5'
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </label>
  );
}
