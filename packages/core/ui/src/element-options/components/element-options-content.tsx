import * as Popover from '@radix-ui/react-popover';
import { useYooptaEditor } from '@yoopta/editor';

import { useElementOptionsContext } from '../context/element-options-context';
import type { ElementOptionsContentProps } from '../types';

export const ElementOptionsContent = ({
  children,
  className,
  style,
  side = 'bottom',
  align = 'end',
  sideOffset = 4,
  alignOffset = 0,
}: ElementOptionsContentProps) => {
  const { isOpen } = useElementOptionsContext();
  const editor = useYooptaEditor();

  if (!isOpen) return null;

  return (
    <Popover.Portal container={editor.refElement}>
      <Popover.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={8}
        className={className}
        style={style}
        data-element-options-content
        data-state="open"
        data-side={side}
        data-align={align}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}>
        {children}
      </Popover.Content>
    </Popover.Portal>
  );
};

ElementOptionsContent.displayName = 'ElementOptions.Content';
