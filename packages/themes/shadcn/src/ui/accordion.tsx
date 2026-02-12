'use client';

import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '../utils';

const Accordion = forwardRef<HTMLDivElement, ComponentProps<typeof AccordionPrimitive.Root>>(
  ({ children, className, ...props }, ref) => (
    <AccordionPrimitive.Root
      {...props}
      className={cn("w-full rounded-md border", className)}
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

const AccordionTrigger = ({
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Trigger
    {...props}
    type="button"
    contentEditable={false}
    data-slot="accordion-trigger"
    className="flex shrink-0 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
    {children}
  </AccordionPrimitive.Trigger>
);

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
