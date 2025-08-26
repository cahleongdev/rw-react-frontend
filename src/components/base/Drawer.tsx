import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/utils/tailwind';

import { Button } from '@/components/base/Button';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  width?: string;
  side?: 'left' | 'right';
  hideCloseButton?: boolean;
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  className,
  width = '600px',
  side = 'right',
  hideCloseButton = false,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Handle visibility state for animations
  useEffect(() => {
    if (open) {
      // Show the drawer immediately when open is true
      setIsVisible(true);
    } else {
      // Delay hiding to allow exit animation to complete
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this with the animation duration
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      // Add a small delay to prevent immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open, onClose]);

  // Don't render anything if not visible and not open
  if (!isVisible && !open) return null;

  return (
    <div
      className={cn(
        'absolute inset-y-0 z-50 flex flex-col shadow-lg border-slate-200',
        side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
        'transition-all duration-300 ease-in-out',
        open
          ? 'translate-x-0 opacity-100'
          : side === 'right'
            ? 'translate-x-full opacity-0'
            : '-translate-x-full opacity-0',
        className,
      )}
      style={{
        width,
        backgroundColor: 'white',
      }}
      ref={drawerRef}
    >
      {!hideCloseButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out overflow-hidden grow',
          open
            ? 'translate-x-0 opacity-100'
            : side === 'right'
              ? 'translate-x-20 opacity-0'
              : '-translate-x-20 opacity-0',
        )}
      >
        {children}
      </div>
    </div>
  );
};

export { Drawer };
