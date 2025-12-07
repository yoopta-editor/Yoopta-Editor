import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';

const Accordion = forwardRef<HTMLDivElement, ComponentProps<typeof AccordionPrimitive.Root>>(
  ({ children, ...props }, ref) => (
    <AccordionPrimitive.Root
      {...props}
      className="w-full rounded-md border"
      ref={ref}
      data-slot="accordion">
      {children}
    </AccordionPrimitive.Root>
  ),
);
Accordion.displayName = 'Accordion';

const AccordionItem = forwardRef<HTMLDivElement, ComponentProps<typeof AccordionPrimitive.Item>>(
  ({ children, ...props }, ref) => (
    <AccordionPrimitive.Item
      {...props}
      ref={ref}
      data-slot="accordion-item"
      className="border-b last:border-b-0">
      {children}
    </AccordionPrimitive.Item>
  ),
);

AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof AccordionPrimitive.Trigger>
>(({ children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    {children}
    <AccordionPrimitive.Trigger
      {...props}
      ref={ref}
      data-slot="accordion-trigger"
      className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180 px-5">
      <span contentEditable={false} className="pointer-events-none">
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof AccordionPrimitive.Content>
>(({ children, ...props }, ref) => (
  <AccordionPrimitive.Content
    {...props}
    ref={ref}
    data-slot="accordion-content"
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm">
    <div className="pt-0 pb-4 text-muted-foreground px-5">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
