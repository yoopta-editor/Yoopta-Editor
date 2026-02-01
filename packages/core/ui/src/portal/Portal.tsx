import type { ReactNode } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';

type Props = {
  children: ReactNode;
  id: string;
};

const Portal = (props: Props) => {
  const editor = useYooptaEditor();

  return (
    <FloatingPortal id={`${props.id}-${editor.id}`} root={editor.refElement}>
      {props.children}
    </FloatingPortal>
  );
};

export { Portal };
