import { useEffect } from 'react';

export function useKeyboardShortcuts(keysMap: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const [key, handler] of Object.entries(keysMap)) {
        const normalizedKey = key.toLowerCase();
        const isCtrlCmd = e.ctrlKey || e.metaKey;

        if (normalizedKey.startsWith('ctrl+') || normalizedKey.startsWith('cmd+')) {
          const actualKey = normalizedKey.split('+')[1];
          if (isCtrlCmd && e.key.toLowerCase() === actualKey) {
            e.preventDefault();
            handler();
            return;
          }
        } else if (normalizedKey === 'escape' || normalizedKey === 'esc') {
          if (e.key === 'Escape') {
            handler();
            return;
          }
        } else if (normalizedKey === 'arrowleft' || normalizedKey === 'left') {
          if (e.key === 'ArrowLeft') {
            handler();
            return;
          }
        } else if (normalizedKey === 'arrowright' || normalizedKey === 'right') {
          if (e.key === 'ArrowRight') {
            handler();
            return;
          }
        } else if (normalizedKey === 'arrowup' || normalizedKey === 'up') {
          if (e.key === 'ArrowUp') {
            handler();
            return;
          }
        } else if (normalizedKey === 'arrowdown' || normalizedKey === 'down') {
          if (e.key === 'ArrowDown') {
            handler();
            return;
          }
        } else if (normalizedKey === 'enter') {
          if (e.key === 'Enter') {
            handler();
            return;
          }
        } else if (normalizedKey === ' ') {
          if (e.key === ' ') {
            handler();
            return;
          }
        } else if (e.key.toLowerCase() === normalizedKey) {
          handler();
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keysMap]);
}
