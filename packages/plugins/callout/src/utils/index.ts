import type { CSSProperties } from 'react';

import type { CalloutTheme } from '../types';

export const CALLOUT_THEME_STYLES: Record<CalloutTheme, CSSProperties> = {
  default: {
    backgroundColor: '#f5f7f9',
    color: '#000',
  },
  info: {
    backgroundColor: '#e1f3fe',
    color: '#08a2e7',
    borderLeft: '4px solid #08a2e7',
  },
  success: {
    backgroundColor: '#d1fae5',
    color: '#12b77f',
    borderLeft: '4px solid #12b77f',
  },
  warning: {
    backgroundColor: '#fef3c9',
    color: '#f97415',
    borderLeft: '4px solid #f97415',
  },
  error: {
    backgroundColor: '#fee1e2',
    color: '#ee4443',
    borderLeft: '4px solid #ee4443',
  },
};
