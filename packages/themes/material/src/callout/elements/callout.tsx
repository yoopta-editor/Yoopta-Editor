import { useMemo } from 'react';
import { Alert } from '@mui/material';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';

type CalloutTheme = 'default' | 'success' | 'warning' | 'error' | 'info';

const getSeverity = (theme: CalloutTheme = 'default'): 'error' | 'info' | 'success' | 'warning' => {
  const severityMap: Record<CalloutTheme, 'error' | 'info' | 'success' | 'warning'> = {
    default: 'info',
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
  };

  return severityMap[theme];
};

export const Callout = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;

  const theme = useMemo(() => {
    const calloutElement = element as SlateElement<'callout', { theme?: CalloutTheme }>;
    return calloutElement.props?.theme ?? 'default';
  }, [element]);

  const severity = getSeverity(theme);

  return (
    <Alert
      {...attributes}
      severity={severity}
      sx={{
        borderRadius: 1,
        borderLeft: '4px solid',
        borderLeftColor: 'currentColor',
        '& .MuiAlert-message': {
          width: '100%',
          '& p': {
            margin: 0,
            fontSize: '0.875rem',
          },
        },
      }}>
      {children}
    </Alert>
  );
};
