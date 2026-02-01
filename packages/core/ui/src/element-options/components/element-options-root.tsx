import { useMemo, useRef, useState } from 'react';
import { useYooptaEditor } from '@yoopta/editor';

import { ElementOptionsContext } from '../context/element-options-context';
import type { ElementOptionsRootProps } from '../types';

export const ElementOptionsRoot = ({
  blockId,
  element,
  children,
  anchorRef,
  className,
  style,
}: ElementOptionsRootProps) => {
  const editor = useYooptaEditor();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const contextValue = useMemo(
    () => ({
      blockId,
      element,
      editor,
      isOpen,
      setIsOpen,
      triggerRef,
      contentRef,
      anchorRef: anchorRef ?? null,
    }),
    [blockId, element, editor, isOpen, anchorRef],
  );

  return (
    <ElementOptionsContext.Provider value={contextValue}>
      <div
        className={className}
        style={style}
        data-element-options-root
        data-state={isOpen ? 'open' : 'closed'}>
        {children}
      </div>
    </ElementOptionsContext.Provider>
  );
};

ElementOptionsRoot.displayName = 'ElementOptions.Root';
