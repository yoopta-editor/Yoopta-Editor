import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { useYooptaEditor } from '@yoopta/editor';

type Props = {
  children: ReactNode;
  id: string;
};

// Global map to track portal container usage count per editor
const portalContainerRefs = new WeakMap<HTMLElement, number>();

// Get or create portal container synchronously
const getOrCreatePortalContainer = (editorEl: HTMLElement): HTMLElement => {
  let portalContainer = editorEl.querySelector('.yoopta-portal-container') as HTMLElement;

  if (!portalContainer) {
    portalContainer = document.createElement('div');
    portalContainer.className = 'yoopta-portal-container';
    editorEl.appendChild(portalContainer);
    portalContainerRefs.set(portalContainer, 0);
  }

  return portalContainer;
};

const Portal = (props: Props) => {
  const editor = useYooptaEditor();
  const rootElRef = useRef<HTMLElement | null>(null);
  const [, forceUpdate] = useState(0);

  // Initialize portal container synchronously on first render
  if (!rootElRef.current && editor.refElement) {
    rootElRef.current = getOrCreatePortalContainer(editor.refElement);
    // Increment usage count
    const currentCount = portalContainerRefs.get(rootElRef.current) ?? 0;
    portalContainerRefs.set(rootElRef.current, currentCount + 1);
  }

  // Handle cleanup and editor changes
  useLayoutEffect(() => {
    const editorEl = editor.refElement;
    if (!editorEl) return;

    // If rootEl doesn't match current editor, update it
    if (!rootElRef.current || !editorEl.contains(rootElRef.current)) {
      rootElRef.current = getOrCreatePortalContainer(editorEl);
      const currentCount = portalContainerRefs.get(rootElRef.current) ?? 0;
      portalContainerRefs.set(rootElRef.current, currentCount + 1);
      forceUpdate((n) => n + 1);
    }

    return () => {
      if (rootElRef.current) {
        // Decrement usage count
        const count = portalContainerRefs.get(rootElRef.current) ?? 0;
        const newCount = Math.max(0, count - 1);
        portalContainerRefs.set(rootElRef.current, newCount);

        // Only remove container if no portals are using it
        if (newCount === 0 && rootElRef.current.parentNode) {
          rootElRef.current.remove();
          portalContainerRefs.delete(rootElRef.current);
        }
        rootElRef.current = null;
      }
    };
  }, [editor.refElement]);

  if (!rootElRef.current) return null;

  return (
    <FloatingPortal id={`${props.id}-${editor.id}`} root={rootElRef.current}>
      {props.children}
    </FloatingPortal>
  );
};

export { Portal };
