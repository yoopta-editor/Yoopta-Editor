import { createContext, useState } from 'react';

type YooptaUIContextProps = {
  hoveredBlockId: string | null;
  onSetHoveredBlockId: (blockId: string | null) => void;
};

export const YooptaUIContext = createContext<YooptaUIContextProps>({
  hoveredBlockId: null,
  onSetHoveredBlockId: () => {},
});

export const YooptaUI = ({ children }: { children: React.ReactNode }) => {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  const onSetHoveredBlockId = (blockId: string | null) => {
    setHoveredBlockId(blockId);
  };

  return (
    <YooptaUIContext.Provider value={{ hoveredBlockId, onSetHoveredBlockId }}>
      {children}
    </YooptaUIContext.Provider>
  );
};
