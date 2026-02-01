import { createContext, useContext } from 'react';
import { Elements } from '@yoopta/editor';

import type { ElementOptionsContextValue } from '../types';

export const ElementOptionsContext = createContext<ElementOptionsContextValue | null>(null);
ElementOptionsContext.displayName = 'ElementOptionsContext';

export function useElementOptionsContext(): ElementOptionsContextValue {
  const context = useContext(ElementOptionsContext);

  if (!context) {
    throw new Error('useElementOptionsContext must be used within an ElementOptions.Root');
  }

  return context;
}

export function useElementOptions() {
  const { blockId, element, editor, isOpen, setIsOpen } = useElementOptionsContext();
  return { blockId, element, editor, isOpen, setIsOpen };
}

export function useUpdateElementProps<T extends Record<string, unknown>>() {
  const { blockId, element, editor } = useElementOptionsContext();

  return (props: Partial<T>) => {
    Elements.updateElement(editor, {
      blockId,
      type: element.type,
      props: { ...element.props, ...props },
    });
  };
}

