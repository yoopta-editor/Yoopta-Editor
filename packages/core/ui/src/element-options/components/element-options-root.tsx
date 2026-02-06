import { useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useYooptaEditor } from '@yoopta/editor';

import { ElementOptionsContext } from '../context/element-options-context';
import type { ElementOptionsRootProps } from '../types';

export const ElementOptionsRoot = ({
  blockId,
  element,
  children,
  className,
  style,
}: ElementOptionsRootProps) => {
  const editor = useYooptaEditor();
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      blockId,
      element,
      editor,
      isOpen,
      setIsOpen,
    }),
    [blockId, element, editor, isOpen],
  );

  return (
    <ElementOptionsContext.Provider value={contextValue}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={className}
          style={style}
          data-element-options-root
          data-state={isOpen ? 'open' : 'closed'}>
          {children}
        </div>
      </Popover.Root>
    </ElementOptionsContext.Provider>
  );
};

ElementOptionsRoot.displayName = 'ElementOptions.Root';
