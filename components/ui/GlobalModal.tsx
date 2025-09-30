'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReactNode, useState, useCallback } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';

type ActionButton = {
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

interface GlobalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
  className?: string;
  hideFooter?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  full: 'sm:max-w-full',
};

export function GlobalModal({
  isOpen,
  onOpenChange,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  primaryAction,
  secondaryAction,
  className = '',
  hideFooter = false,
}: GlobalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${sizeClasses[size]} ${className}`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>

        {!hideFooter && (primaryAction || secondaryAction) && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outline'}
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled || secondaryAction.loading}
              >
                {secondaryAction.loading ? 'Carregando...' : secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'default'}
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled || primaryAction.loading}
                className="ml-2"
              >
                {primaryAction.loading ? 'Salvando...' : primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback((prev: boolean) => setIsOpen(!prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    props: {
      isOpen,
      onOpenChange: setIsOpen,
    },
  };
}
