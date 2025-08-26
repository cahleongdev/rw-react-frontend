import React from 'react';
import { confirmable, createConfirmation } from 'react-confirm';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from '@/components/base/Dialog';
import { Button } from '@/components/base/Button';
import { cn } from '@/utils/tailwind';

interface ConfirmationProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: string;
  cancelButtonStyle?: string;
}

const ConfirmationContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentProps<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          'fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

const ConfirmationDialog: React.FC<ConfirmationProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Ok',
  cancelText = 'Cancel',
  cancelButtonStyle,
  confirmButtonStyle,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <ConfirmationContent className="bg-white">
        <DialogTitle>{title}</DialogTitle>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">{message}</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className={cancelButtonStyle}
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
            <Button
              className={cn(
                'bg-blue-500 hover:bg-blue-600 text-white',
                confirmButtonStyle,
              )}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </ConfirmationContent>
    </Dialog>
  );
};

export const confirm = createConfirmation(confirmable(ConfirmationDialog));
