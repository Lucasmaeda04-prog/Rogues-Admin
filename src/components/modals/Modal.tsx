'use client';

import { cn } from '@/lib/cn';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useEffect } from 'react';

export type ModalProps = {
  children: ReactNode;
  onClose: (value: boolean) => void;
  isOpen: boolean;
  style?: React.CSSProperties;
  className?: {
    blur?: string;
    modal?: string;
  };
  blur?: boolean;
  hiddenClose?: boolean;
};

export function Modal({
  children,
  onClose,
  className,
  blur = true,
  hiddenClose = false,
  style,
  isOpen,
}: ModalProps) {
  const handleCloseEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose(false);
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleCloseEscKey);

    return () => {
      document.removeEventListener('keydown', handleCloseEscKey);
    };
  }, [handleCloseEscKey]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        onClick={() => onClose(false)}
        className={cn(
          'fixed left-0 top-0 z-[100] flex size-full animate-fade cursor-pointer items-center bg-black/10 animate-duration-[400ms] animate-once animate-ease-linear',
          {
            'backdrop-blur-md': blur,
          },
          className?.blur,
        )}
      />

      <div
        style={style}
        className={cn(
          'fixed inset-0 z-[999] mt-6 m-auto h-fit w-full max-w-[600px] animate-fade-down sm:animate-fade-up animate-duration-300 animate-once animate-ease-linear',
          className?.modal,
        )}
      >
        {!hiddenClose && (
          <button
            onClick={() => onClose(false)}
            className="flex rounded-tr-2xl z-[1000] w-fit ml-auto justify-end absolute top-0 right-0"
          >
            <div
              className="p-8 bg-white rounded-tr-2xl"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%)',
              }}
            >
              <div className="hover:opacity-80 relative left-5 bottom-3 z-10 transition-opacity">
                <X size={30} className={`text-black`} />
              </div>
            </div>
          </button>
        )}
        
        <div className="h-auto w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
