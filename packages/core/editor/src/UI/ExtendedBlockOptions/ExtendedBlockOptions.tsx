import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating,
  useTransitionStyles,
} from '@floating-ui/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { useYooptaReadOnly } from '../../contexts/YooptaContext/YooptaContext';

type Props = {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: ReactNode;
};

// move to @yoopta/ui packages in next PR
const ExtendedBlockOptions = ({ id, className, style, onClick, children }: Props) => {
  const isReadOnly = useYooptaReadOnly();
  const [isBlockOptionsOpen, setIsBlockOptionsOpen] = useState(false);

  // remove after move to @yoopta/ui packages
  const {
    refs: blockOptionRefs,
    floatingStyles: blockOptionFloatingStyles,
    context,
  } = useFloating({
    placement: 'bottom-start',
    open: isBlockOptionsOpen,
    onOpenChange: setIsBlockOptionsOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles: blockOptionsTransitionStyles } = useTransitionStyles(context, {
    duration: 100,
  });

  const onDotsClick = () => {
    onClick?.();
    setIsBlockOptionsOpen(true);
  };

  const blockOptionsStyle = { ...blockOptionsTransitionStyles, ...blockOptionFloatingStyles };

  if (isReadOnly) return null;

  return (
    <>
      <button
        type="button"
        contentEditable={false}
        ref={blockOptionRefs.setReference}
        id={id}
        className={`yoopta-button yoopta-extended-block-actions ${className || ''}`}
        onClick={onDotsClick}
        style={isBlockOptionsOpen ? { ...style, opacity: 1 } : style}>
        <DotsHorizontalIcon />
      </button>
    </>
  );
};

export { ExtendedBlockOptions };
