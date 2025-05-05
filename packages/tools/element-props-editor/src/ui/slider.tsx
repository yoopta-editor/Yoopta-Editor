import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from 'src/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'yoo-elements-relative yoo-elements-flex yoo-elements-w-full yoo-elements-touch-none yoo-elements-select-none yoo-elements-items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="yoo-elements-relative yoo-elements-h-1.5 yoo-elements-w-full yoo-elements-grow yoo-elements-overflow-hidden yoo-elements-rounded-full yoo-elements-bg-primary/20">
      <SliderPrimitive.Range className="yoo-elements-absolute yoo-elements-h-full yoo-elements-bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="yoo-elements-block yoo-elements-h-4 yoo-elements-w-4 yoo-elements-rounded-full yoo-elements-border yoo-elements-border-primary/50 yoo-elements-bg-background yoo-elements-shadow yoo-elements-transition-colors focus-visible:yoo-elements-outline-none focus-visible:yoo-elements-ring-1 focus-visible:yoo-elements-ring-ring disabled:yoo-elements-pointer-events-none disabled:yoo-elements-opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
