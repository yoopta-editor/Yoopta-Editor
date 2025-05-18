import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '../../../utils';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'yoo-mention-flex yoo-mention-h-full yoo-mention-w-full yoo-mention-flex-col yoo-mention-overflow-hidden yoo-mention-rounded-md yoo-mention-bg-white yoo-mention-text-neutral-900 yoo-mention-shadow-lg yoo-mention-border yoo-mention-border-neutral-200',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="yoo-mention-flex yoo-mention-items-center yoo-mention-border-b yoo-mention-px-3 yoo-mention-bg-neutral-50">
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'yoo-mention-flex yoo-mention-h-11 yoo-mention-w-full yoo-mention-rounded-md yoo-mention-bg-transparent yoo-mention-py-3 yoo-mention-text-sm yoo-mention-outline-none yoo-mention-placeholder:text-neutral-400 yoo-mention-disabled:cursor-not-allowed yoo-mention-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('yoo-mention-max-h-[300px] yoo-mention-overflow-y-auto yoo-mention-overflow-x-hidden', className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="yoo-mention-py-2 yoo-mention-text-center yoo-mention-text-sm yoo-mention-text-neutral-500"
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'yoo-mention-overflow-hidden yoo-mention-p-1 yoo-mention-text-neutral-800 [&_[cmdk-group-heading]]:yoo-mention-px-2 [&_[cmdk-group-heading]]:yoo-mention-py-1.5 [&_[cmdk-group-heading]]:yoo-mention-text-xs [&_[cmdk-group-heading]]:yoo-mention-font-medium [&_[cmdk-group-heading]]:yoo-mention-text-neutral-400',
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    disabled={false}
    className={cn(
      'yoo-mention-relative yoo-mention-flex yoo-mention-cursor-pointer yoo-mention-select-none yoo-mention-items-center yoo-mention-rounded-sm yoo-mention-px-2 yoo-mention-py-1.5 yoo-mention-text-sm yoo-mention-outline-none hover:yoo-mention-bg-neutral-200 hover:yoo-mention-text-black aria-selected:yoo-mention-bg-neutral-100 aria-selected:yoo-mention-text-black data-[disabled="true"]:yoo-mention-pointer-events-none data-[disabled="true"]:yoo-mention-opacity-50',
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem };
