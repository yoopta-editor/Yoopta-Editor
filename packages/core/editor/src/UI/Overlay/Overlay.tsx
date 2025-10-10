import type { MouseEvent, ReactNode } from 'react';
import { FloatingOverlay } from '@floating-ui/react';

type Props = {
  children: ReactNode;
  lockScroll?: boolean;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  style?: React.CSSProperties;
};

const Overlay = ({ className, children, lockScroll = true, ...props }: Props) => {
  const onMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    props.onMouseDown?.(e);
  };

  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.onClick?.(e);
  };

  return (
    <FloatingOverlay
      lockScroll={lockScroll}
      className={className}
      {...props}
      onClick={onClick}
      onMouseDown={onMouseDown}>
      {children}
    </FloatingOverlay>
  );
};

export { Overlay };
