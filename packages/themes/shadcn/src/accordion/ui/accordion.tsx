import React, { forwardRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '../utils/cn';

const Accordion = forwardRef<HTMLDivElement, React.ComponentProps<typeof AccordionPrimitive.Root>>(
  ({ children, className, ...props }, ref) => (
    <AccordionPrimitive.Root {...props} className={className} ref={ref} data-slot="accordion">
      {children}
    </AccordionPrimitive.Root>
  ),
);
Accordion.displayName = 'Accordion';

const AccordionItem = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof AccordionPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    {...props}
    ref={ref}
    data-slot="accordion-item"
    className={cn('border-b last:border-b-0', className)}>
    {children}
  </AccordionPrimitive.Item>
));

AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  console.log('AccordionTrigger className', className);

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        {...props}
        ref={ref}
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180 px-5',
          className,
        )}>
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    {...props}
    ref={ref}
    data-slot="accordion-content"
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm">
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
