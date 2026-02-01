import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { cn } from '../../utils';

type ThemeOption = {
  value: string;
  label: string;
};

type ThemeSelectProps = {
  value: string;
  options: readonly ThemeOption[];
  onValueChange: (value: string) => void;
  currentLabel: string;
};

export const ThemeSelect = ({ value, options, onValueChange, currentLabel }: ThemeSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower),
    );
  }, [search, options]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" contentEditable={false}>
          {currentLabel}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align="start"
        contentEditable={false}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        <div className="p-2">
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search theme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-7 text-xs"
              autoFocus
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No themes found
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full rounded-sm px-2 py-1.5 text-left text-xs transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      value === option.value && 'bg-accent text-accent-foreground',
                    )}>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
