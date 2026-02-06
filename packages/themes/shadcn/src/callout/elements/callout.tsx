import type { PluginElementRenderProps } from '@yoopta/editor';
import {
  ElementOptions,
} from '@yoopta/ui/element-options';

import { cn } from '../../utils';
import type { CalloutTheme } from '../components/callout-element-options';
import { CalloutElementOptions } from '../components/callout-element-options';

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

export const Callout = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const theme = (element.props?.theme as CalloutTheme) ?? 'default';

  return (
    <div
      {...attributes}
      className={cn(
        'mt-4 group relative rounded-lg border-l-4 p-4 [&>p]:m-0 [&>p]:text-sm',
        getThemeClasses(theme),
      )}>
      <ElementOptions.Root blockId={blockId} element={element}>
        <ElementOptions.Trigger
          className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/10"
        />
        <CalloutElementOptions />
      </ElementOptions.Root>
      {children}
    </div>
  );
};
