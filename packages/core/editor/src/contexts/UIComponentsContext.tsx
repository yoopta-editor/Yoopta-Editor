// packages/core/editor/src/contexts/UIComponentsContext.tsx
import { createContext, useContext, ReactNode } from 'react';

export const UI_COMPONENTS = {
  FloatingBlockActions: 'FloatingBlockActions',
  RenderBlocks: 'RenderBlocks',
  BlockActions: 'BlockActions',
  BlockOptions: 'BlockOptions',
} as const;

export type UIComponents = {
  [key in keyof typeof UI_COMPONENTS]?: ReactNode;
};

const UIComponentsContext = createContext<UIComponents>({});

export const UIComponentsProvider = ({ children, components }: { children: ReactNode; components: UIComponents }) => {
  return <UIComponentsContext.Provider value={components}>{children}</UIComponentsContext.Provider>;
};

export const useUIComponents = () => useContext(UIComponentsContext);
