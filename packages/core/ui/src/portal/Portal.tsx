import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';

type Props = {
  children: ReactNode;
  id: string;
};

// Global map to track portal container usage count per editor
const portalContainerRefs = new WeakMap<HTMLElement, number>();

const Portal = (props: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  const rootEl = useRef<HTMLElement | null>(null);
  const editor = useYooptaEditor();

  useEffect(() => {
    setIsMounted(true);
    const editorEl = editor.refElement;

    if (!editorEl) return;

    // Try to find existing portal container
    let portalContainer = editorEl.querySelector('.yoopta-portal-container') as HTMLElement;

    if (!portalContainer) {
      // Create new container if it doesn't exist
      portalContainer = document.createElement('div');
      portalContainer.className = 'yoopta-portal-container';
      editorEl.appendChild(portalContainer);
      portalContainerRefs.set(portalContainer, 0);
    }

    // Increment usage count
    const currentCount = portalContainerRefs.get(portalContainer) || 0;
    portalContainerRefs.set(portalContainer, currentCount + 1);

    // Store reference to the container
    rootEl.current = portalContainer;

    return () => {
      if (rootEl.current) {
        // Decrement usage count
        const count = portalContainerRefs.get(rootEl.current) || 0;
        const newCount = Math.max(0, count - 1);
        portalContainerRefs.set(rootEl.current, newCount);

        // Only remove container if no portals are using it
        if (newCount === 0 && rootEl.current.parentNode) {
          rootEl.current.remove();
          portalContainerRefs.delete(rootEl.current);
        }
      }
    };
  }, [editor]);

  if (!isMounted || !rootEl.current) return null;

  return (
    <FloatingPortal id={`${props.id}-${editor.id}`} root={rootEl.current}>
      {props.children}
    </FloatingPortal>
  );
};

export { Portal };
