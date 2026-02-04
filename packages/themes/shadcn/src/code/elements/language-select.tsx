import { useYooptaReadOnly } from '@yoopta/editor';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { cn } from '../../utils';

type LanguageOption = {
  value: string;
  label: string;
};

type LanguageSelectProps = {
  value: string;
  options: readonly LanguageOption[];
  onValueChange: (value: string) => void;
  currentLabel: string;
  className?: string;
  style?: React.CSSProperties;
};

export const LanguageSelect = ({
  value,
  options,
  onValueChange,
  currentLabel,
  className,
  style,
}: LanguageSelectProps) => {
  const isReadOnly = useYooptaReadOnly();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={isReadOnly}>
      <SelectTrigger
        size="sm"
        className={cn('h-7 gap-1.5 text-xs font-mono border-transparent hover:border-current/20', className)}
        style={style}
        contentEditable={false}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        <SelectValue placeholder={currentLabel}>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent
        align="start"
        position="popper"
        className="max-h-[200px]"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-xs font-mono">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
