import type * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import cn from 'classnames';

type CheckboxPrimitiveProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

const CheckboxShadcn = ({ className, ...props }: CheckboxPrimitiveProps) => (
  <CheckboxPrimitive.Root
    autoFocus={false}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-[#18181b] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#18181b] data-[state=checked]:text-[#fafafa]',
      className,
    )}
    {...props}>
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <CheckIcon className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

CheckboxShadcn.displayName = CheckboxPrimitive.Root.displayName;

type Props = React.ComponentProps<typeof CheckboxShadcn>;

export const Checkbox = ({
  name,
  checked,
  onCheckedChange: onChange,
  value,
  children,
  attributes,
  ...props
}: Props) => (
    <div className="flex flex-row items-start space-x-3 mt-4" {...attributes}>
      <CheckboxShadcn
        id={name}
        checked={checked}
        value={value}
        onCheckedChange={onChange}
        {...props}
      />
      <div className="grid gap-1.5 leading-none">
        <span
          // htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {children}
        </span>
      </div>
    </div>
  )
