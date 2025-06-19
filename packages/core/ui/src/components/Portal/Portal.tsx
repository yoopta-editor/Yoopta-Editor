import { FloatingPortal } from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';
import { ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  children: ReactNode;
  id: string;
};

const Portal = (props: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const rootEl = useRef<HTMLElement | null>(null);
  const editor = useYooptaEditor();

  useEffect(() => {
    setIsMounted(true);
    const editorEl = editor.refElement;

    if (!editorEl) return;

    const overlays = editorEl.querySelector('.yoopta-overlays');
    if (!overlays) {
      rootEl.current = document.createElement('div');
      rootEl.current.className = 'yoopta-overlays';
      editorEl.appendChild(rootEl.current);
    }

    return () => {
      if (rootEl.current) {
        rootEl.current.remove();
      }
    };
  }, []);

  if (!isMounted) return null;

  return (
    <FloatingPortal id={`${props.id}-${editor.id}`} root={rootEl.current || editor.refElement}>
      {props.children}
    </FloatingPortal>
  );
};

export { Portal };
