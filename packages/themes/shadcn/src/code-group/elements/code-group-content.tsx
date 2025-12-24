import { useRef } from 'react';
import { HighlightedCodeOverlay } from '@yoopta/code';
import type { PluginElementRenderProps } from '@yoopta/editor';

import { TabsContent } from '../../ui/tabs';

export const CodeGroupContent = (props: PluginElementRenderProps) => {
  const { attributes, children, element } = props;
  const overlayRef = useRef<HTMLDivElement>(null);

  const language = element?.props?.language ?? 'javascript';
  const theme = element?.props?.theme ?? 'github-dark';

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.currentTarget.scrollTop;
      overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <TabsContent
      {...attributes}
      value={element.props?.referenceId}
      className="mt-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
      <div className="relative rounded-b-lg overflow-hidden">
        <div
          className="relative bg-background overflow-hidden"
          style={{
            backgroundColor: 'var(--code-group-editor-bg)',
            color: 'var(--code-group-editor-fg)',
            caretColor: 'var(--code-group-editor-cursor)',
          }}>
          <div
            ref={overlayRef}
            className="absolute inset-0 p-4 font-mono text-sm whitespace-pre overflow-auto pointer-events-none z-10 select-none"
            style={{
              lineHeight: '1.6',
              tabSize: 2,
            }}
            contentEditable={false}
            aria-hidden="true">
            <HighlightedCodeOverlay element={element} language={language} theme={theme} />
          </div>

          <div
            className="relative p-4 font-mono text-sm whitespace-pre overflow-auto"
            style={{
              lineHeight: '1.6',
              tabSize: 2,
              color: 'transparent',
              caretColor: 'var(--code-group-editor-cursor)',
            }}
            onScroll={handleScroll}>
            {children}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
