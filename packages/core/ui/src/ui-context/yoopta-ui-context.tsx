import { createContext, useRef, useState, MutableRefObject } from 'react';

type YooptaUIRefs = {
  floatingBlockActions: {
    root: HTMLElement | null;
  };
  blockOptions: {
    anchor: HTMLElement | null;
    floating: HTMLElement | null;
  };
  actionMenu: {
    anchor: HTMLElement | null;
    floating: HTMLElement | null;
  };
};

type YooptaUIState = {
  blockOptions: {
    isOpen: boolean;
    blockId: string | null;
  };
  actionMenu: {
    isOpen: boolean;
  };
};

type YooptaUIContextProps = {
  // FloatingBlockActions
  hoveredBlockId: string | null;
  onSetHoveredBlockId: (blockId: string | null) => void;
  frozenBlockId: string | null;
  onSetFrozenBlockId: (blockId: string | null) => void;

  // UI Refs - доступ без re-render
  uiRefs: MutableRefObject<YooptaUIRefs>;

  // UI State - только флаги
  uiState: YooptaUIState;
  setUIState: (updates: Partial<YooptaUIState>) => void;
};

export const YooptaUIContext = createContext<YooptaUIContextProps>({
  hoveredBlockId: null,
  onSetHoveredBlockId: () => {},
  frozenBlockId: null,
  onSetFrozenBlockId: () => {},
  uiRefs: {
    current: {
      floatingBlockActions: { root: null },
      blockOptions: { anchor: null, floating: null },
      actionMenu: { anchor: null, floating: null },
    },
  } as MutableRefObject<YooptaUIRefs>,
  uiState: {
    blockOptions: { isOpen: false, blockId: null },
    actionMenu: { isOpen: false },
  },
  setUIState: () => {},
});

type YooptaUIProps = {
  children: React.ReactNode;
  theme?: Record<string, any>;
};

export const YooptaUI = ({ children }: YooptaUIProps) => {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [frozenBlockId, setFrozenBlockId] = useState<string | null>(null);

  const uiRefs = useRef<YooptaUIRefs>({
    floatingBlockActions: { root: null },
    blockOptions: { anchor: null, floating: null },
    actionMenu: { anchor: null, floating: null },
  });

  const [uiState, setUIStateRaw] = useState<YooptaUIState>({
    blockOptions: { isOpen: false, blockId: null },
    actionMenu: { isOpen: false },
  });

  const onSetHoveredBlockId = (blockId: string | null) => {
    setHoveredBlockId(blockId);
  };

  const onSetFrozenBlockId = (blockId: string | null) => {
    setFrozenBlockId(blockId);
  };

  const setUIState = (updates: Partial<YooptaUIState>) => {
    setUIStateRaw((prev) => {
      const next = { ...prev };

      if (updates.blockOptions) {
        next.blockOptions = { ...prev.blockOptions, ...updates.blockOptions };
      }
      if (updates.actionMenu) {
        next.actionMenu = { ...prev.actionMenu, ...updates.actionMenu };
      }

      return next;
    });
  };

  return (
    <YooptaUIContext.Provider
      value={{
        hoveredBlockId,
        onSetHoveredBlockId,
        frozenBlockId,
        onSetFrozenBlockId,
        uiRefs,
        uiState,
        setUIState,
      }}>
      {children}
    </YooptaUIContext.Provider>
  );
};
