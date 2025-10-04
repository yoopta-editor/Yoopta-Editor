import * as SelectPrimitive from '@radix-ui/react-select';
import { useYooptaEditor } from '@yoopta/editor';

import CheckmarkIcon from '../icons/checkmark.svg';
import DownIcon from '../icons/down.svg';

const SelectRoot: typeof SelectPrimitive.Root = SelectPrimitive.Root;
const SelectValue: typeof SelectPrimitive.Value = SelectPrimitive.Value;

const SelectTrigger = ({ children, className }) => (
    <SelectPrimitive.Trigger
      className={`yoopta-code-select yoo-code-bg-[#fff] yoo-code-h-[20px] yoo-code-absolute yoo-code-top-[8px] yoo-code-left-[8px] yoo-code-z-20 yoo-code-min-w-[80px] yoo-code-max-w-[250px] yoo-code-w-auto yoo-code-flex yoo-code-h-9 yoo-code-items-center yoo-code-justify-between yoo-code-whitespace-nowrap yoo-code-rounded-sm yoo-code-border-solid yoo-code-border-[#e5e7eb] yoo-code-px-[5px] yoo-code-py-0 yoo-code-text-sm yoo-code-shadow-sm yoo-code-ring-offset-background focus:yoo-code-outline-none focus:yoo-code-ring-1 focus:yoo-code-ring-ring disabled:yoo-code-cursor-not-allowed disabled:yoo-code-opacity-50 [&>span]:yoo-code-line-clamp-1 ${className}`}>
      {children}
      <SelectPrimitive.Icon asChild>
        <DownIcon className="yoo-code-h-4 yoo-code-w-4 yoo-code-opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );

const SelectContent = ({ children }) => {
  const editor = useYooptaEditor();

  return (
    <SelectPrimitive.Portal container={editor.refElement}>
      <SelectPrimitive.Content
        className="yoo-code-relative yoo-code-z-[120] yoo-code-max-h-96 yoo-code-min-w-[8rem] yoo-code-overflow-hidden yoo-code-rounded-md yoo-code-border-solid yoo-code-border-[#e3e3e3] yoo-code-bg-[#ffffff] yoo-code-text-popover-foreground yoo-code-shadow-md data-[state=open]:yoo-code-animate-in data-[state=closed]:yoo-code-animate-out data-[state=closed]:yoo-code-fade-out-0 data-[state=open]:yoo-code-fade-in-0 data-[state=closed]:yoo-code-zoom-out-95 data-[state=open]:yoo-code-zoom-in-95 data-[side=bottom]:yoo-code-slide-in-from-top-2 data-[side=left]:yoo-code-slide-in-from-right-2 data-[side=right]:yoo-code-slide-in-from-left-2 data-[side=top]:yoo-code-slide-in-from-bottom-2 data-[side=bottom]:yoo-code-translate-y-1 data-[side=left]:-yoo-code-translate-x-1 data-[side=right]:yoo-code-translate-x-1 data-[side=top]:-yoo-code-translate-y-1"
        position="popper"
        side="left"
        align="center"
        alignOffset={5}
        sideOffset={5}
        id="yoo-select-content">
        <SelectPrimitive.Viewport className="yoo-code-p-1 yoo-code-h-[var(--radix-select-trigger-height)] yoo-code-w-full yoo-code-min-w-[var(--radix-select-trigger-width)]">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

const SelectItem = ({ value, children, onChange }) => (
    <button
      type="button"
      className="yoopta-button yoo-code-relative yoo-code-flex yoo-code-w-full yoo-code-cursor-pointer yoo-code-select-none yoo-code-items-center yoo-code-rounded-sm yoo-code-py-1.5 yoo-code-pl-2 yoo-code-pr-2 yoo-code-text-sm yoo-code-outline-none focus:yoo-code-bg-[#eeeeee] focus:yoo-code-text-accent-foreground data-[disabled]:yoo-code-pointer-events-none data-[disabled]:yoo-code-opacity-50"
      onClick={(e) => onChange(value)}>
      <span className="yoo-code-capitalize yoo-code-flex yoo-code-justify-between yoo-code-items-center yoo-code-w-full">
        {children}
      </span>
    </button>
  );

type SelectProps = {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
  className?: string;
  children?: React.ReactNode;
};

const Select = ({ options, onChange, value, children, className }: SelectProps) => (
    <SelectRoot value={value}>
      {children}
      <SelectContent>
        {options.map((option) => {
          const isCurrent = option.value === value;

          return (
            <SelectItem key={option.value} value={option.value} onChange={onChange}>
              {option.label}
              {isCurrent && <CheckmarkIcon />}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectRoot>
  );

export { Select, SelectTrigger, SelectRoot, SelectValue, SelectContent, SelectItem };
