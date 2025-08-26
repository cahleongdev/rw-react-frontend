import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/utils/tailwind';

interface ListTooltipContentProps
  extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  children: React.ReactNode;
}

export function ListTooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: ListTooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50',
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/base/Tooltip';
