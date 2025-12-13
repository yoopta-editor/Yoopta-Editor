import { useMemo } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';

import { cn } from '../../utils';

type CalloutTheme = 'default' | 'success' | 'warning' | 'error' | 'info';

const getThemeClasses = (theme: CalloutTheme = 'default'): string => {
  const themeClasses: Record<CalloutTheme, string> = {
    default: 'bg-muted text-muted-foreground',
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

export const Callout = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  const theme = useMemo(() => {
    const calloutElement = element as SlateElement<'callout', { theme?: CalloutTheme }>;
    return calloutElement.props?.theme ?? 'default';
  }, [element]);

  return (
    <div
      {...attributes}
      className={cn(
        'relative rounded-lg border-l-4 p-4 [&>p]:m-0 [&>p]:text-sm',
        getThemeClasses(theme),
      )}>
      {children}
    </div>
  );
};
