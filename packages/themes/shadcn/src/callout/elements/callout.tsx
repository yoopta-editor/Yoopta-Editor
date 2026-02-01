import type { PluginElementRenderProps } from '@yoopta/editor';
import {
  ElementOptions,
  useElementOptions,
  useUpdateElementProps,
} from '@yoopta/ui/element-options';
import { AlertCircle, CheckCircle, Info, MessageSquare, XCircle } from 'lucide-react';

import { cn } from '../../utils';

type CalloutTheme = 'default' | 'success' | 'warning' | 'error' | 'info';

type CalloutElementProps = {
  theme: CalloutTheme;
};

const getThemeClasses = (theme: CalloutTheme = 'default'): string => {
  const themeClasses: Record<CalloutTheme, string> = {
    default: 'bg-muted text-muted-foreground border-muted-foreground/20',
    info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800',
    success:
      'bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800',
    warning:
      'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800',
    error:
      'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800',
  };

  return themeClasses[theme];
};

const CALLOUT_THEMES = [
  { value: 'default' as const, label: 'Default', icon: <MessageSquare className="h-4 w-4" /> },
  { value: 'info' as const, label: 'Info', icon: <Info className="h-4 w-4 text-blue-500" /> },
  { value: 'success' as const, label: 'Success', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  { value: 'warning' as const, label: 'Warning', icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
  { value: 'error' as const, label: 'Error', icon: <XCircle className="h-4 w-4 text-red-500" /> },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CalloutOptionsContent = () => {
  const { element } = useElementOptions();
  const updateProps = useUpdateElementProps<CalloutElementProps>();

  return (
    <ElementOptions.Content
      side="right"
      align="start"
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

export const Callout = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;
  const theme = (element.props?.theme as CalloutTheme) ?? 'default';

  return (
    <div
      {...attributes}
      className={cn(
        'mt-4 group relative rounded-lg border-l-4 p-4 [&>p]:m-0 [&>p]:text-sm',
        getThemeClasses(theme),
      )}>
      {children}
    </div>
  );
};
