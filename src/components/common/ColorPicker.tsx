import { useRef } from 'react';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_PRESET_COLORS = [
  '#FF6B6B',
  '#FF8FAB',
  '#FFA07A',
  '#FFD93D',
  '#F7DC6F',
  '#6BCB77',
  '#4D96FF',
  '#5DADE2',
  '#9B59B6',
  '#BB8FCE',
  '#95A5A6',
  '#34495E',
];

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  label?: string;
}

export default function ColorPicker({
  value,
  onChange,
  presetColors = DEFAULT_PRESET_COLORS,
  label,
}: ColorPickerProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2.5 items-center">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              'w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 relative',
              value.toLowerCase() === color.toLowerCase() &&
                'ring-2 ring-primary-400 ring-offset-2'
            )}
            style={{ backgroundColor: color }}
            aria-label={`选择颜色 ${color}`}
          />
        ))}
        <button
          type="button"
          onClick={() => colorInputRef.current?.click()}
          className={cn(
            'w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110',
            'flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200',
            !presetColors.includes(value.toLowerCase()) &&
              'ring-2 ring-primary-400 ring-offset-2'
          )}
          aria-label="自定义颜色"
        >
          <Palette className="w-4 h-4 text-gray-600" />
        </button>
        <input
          ref={colorInputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
      </div>
    </div>
  );
}
