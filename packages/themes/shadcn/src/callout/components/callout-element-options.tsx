import {
  ElementOptions,
  useElementOptions,
  useUpdateElementProps,
} from '@yoopta/ui/element-options';
import { AlertCircle, CheckCircle, Info, MessageSquare, XCircle } from 'lucide-react';

export const CALLOUT_THEMES = [
  { value: 'default' as const, label: 'Default', icon: <MessageSquare className="h-4 w-4" /> },
  { value: 'info' as const, label: 'Info', icon: <Info className="h-4 w-4 text-blue-500" /> },
  { value: 'success' as const, label: 'Success', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { value: 'warning' as const, label: 'Warning', icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
  { value: 'error' as const, label: 'Error', icon: <XCircle className="h-4 w-4 text-red-500" /> },
];

export type CalloutTheme = 'default' | 'success' | 'warning' | 'error' | 'info';


type CalloutElementProps = {
  theme: CalloutTheme;
};

export const CalloutElementOptions = () => {
  const { element } = useElementOptions();
  const updateProps = useUpdateElementProps<CalloutElementProps>();

  return (
    <ElementOptions.Content
      side="bottom"
      align="end"
      sideOffset={8}
      className="min-w-[160px] rounded-lg border bg-popover p-2 shadow-md">
      <ElementOptions.Group className="flex flex-col gap-1">
        <ElementOptions.Label className="px-2 text-xs font-medium text-muted-foreground">
          Theme
        </ElementOptions.Label>
        <ElementOptions.Select
          value={(element.props?.theme as CalloutTheme) ?? 'default'}
          options={CALLOUT_THEMES}
          onValueChange={(value) => updateProps({ theme: value })}
          className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm hover:bg-accent"
          renderOption={(option) => (
            <span className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
          )}
          renderValue={(option) => (
            <span className="flex items-center gap-2">
              {option?.icon}
              {option?.label ?? 'Select theme'}
            </span>
          )}
        />
      </ElementOptions.Group>
    </ElementOptions.Content>
  );
};
