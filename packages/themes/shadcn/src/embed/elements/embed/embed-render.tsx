import { useEffect, useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useBlockSelected, useElementSelected, useYooptaEditor } from '@yoopta/editor';
import type { EmbedPluginOptions } from '@yoopta/embed';
import { Rnd } from 'react-rnd';

import { EmbedInlineToolbar } from './embed-inline-toolbar';
import { cn } from '../../../utils';
import type { EmbedElementProps } from '../../types';

type Props = {
  blockId: string;
  elementId: string;
  onUpdate: (props: Partial<EmbedElementProps>) => void;
  onDelete: () => void;
  onReplace: () => void;
  attributes: PluginElementRenderProps['attributes'];
  children: React.ReactNode;
  elementProps: EmbedElementProps;
  pluginOptions?: EmbedPluginOptions;
};

export const EmbedRender = ({
  blockId,
  attributes,
  children,
  elementProps,
  onUpdate,
  onDelete,
  onReplace,
  pluginOptions,
}: Props) => {
  const [sizes, setSizes] = useState(elementProps.sizes);
  const { isElementSelected } = useElementSelected();
  const isBlockSelected = useBlockSelected({ blockId });
  const isSelected = isElementSelected && isBlockSelected;
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const editor = useYooptaEditor();

  // Get max sizes from plugin options, with default maxWidth from editor width
  const [maxSizes, setMaxSizes] = useState(() => {
    const editorWidth = editor.refElement?.getBoundingClientRect().width || 0;
    const maxWidth = pluginOptions?.maxWidth ?? editorWidth;

    return {
      maxWidth: typeof maxWidth === 'number' ? maxWidth : editorWidth,
      maxHeight: 0, // reasonable max height
    };
  });

  // Update maxSizes when editor width changes
  useEffect(() => {
    const updateMaxSizes = () => {
      const editorWidth = editor.refElement?.getBoundingClientRect().width || 0;
      const maxWidth = pluginOptions?.maxWidth ?? editorWidth;

      setMaxSizes({
        maxWidth: typeof maxWidth === 'number' ? maxWidth : editorWidth,
        maxHeight: 0,
      });
    };

    updateMaxSizes();

    const resizeObserver = new ResizeObserver(updateMaxSizes);
    if (editor.refElement) {
      resizeObserver.observe(editor.refElement);
    }

    window.addEventListener('resize', updateMaxSizes);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateMaxSizes);
    };
  }, [editor, pluginOptions]);

  const onResizeStop = (_e: any, _direction: any, ref: HTMLElement) => {
    const newWidth = parseInt(ref.style.width, 10);
    const newHeight = parseInt(ref.style.height, 10);

    onUpdate({
      sizes: {
        width: newWidth,
        height: newHeight,
      },
    });
  };

  const onResize = (_e: any, _direction: any, ref: HTMLElement) => {
    const newWidth = parseInt(ref.style.width, 10);
    const newHeight = parseInt(ref.style.height, 10);

    setSizes({
      width: newWidth,
      height: newHeight,
    });
  };

  const provider = elementProps.provider;
  const embedUrl = provider?.embedUrl ?? '';

  const copyEmbed = async () => {
    if (!provider?.url) return;

    try {
      const { default: copyFn } = await import('copy-to-clipboard');
      copyFn(provider.url);
    } catch {
      // silently fail
    }
  };

  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[(elementProps as any).alignment ?? 'center'];

  return (
    <div {...attributes} className={cn('group/embed mt-4 relative transition-all w-full flex', alignmentClass)}>
      <div className="relative" contentEditable={false} ref={embedContainerRef}>
        <Rnd
          style={{
            position: 'relative',
            outline: isSelected ? '.125rem solid rgba(0, 0, 0, 0)' : 'none',
            outlineColor: isSelected ? 'hsl(var(--primary))' : 'none',
            padding: 2
          }}
          onResize={onResize}
          onResizeStop={onResizeStop}
          lockAspectRatio
          minWidth={200}
          minHeight={150}
          maxWidth={maxSizes.maxWidth - 8 || undefined}
          maxHeight={maxSizes.maxHeight || undefined}
          enableResizing={
            isSelected
              ? {
                bottom: false,
                bottomLeft: false,
                bottomRight: false,
                left: true,
                right: true,
                top: false,
                topLeft: false,
                topRight: false,
              }
              : false
          }
          disableDragging
          resizeHandleStyles={{
            left: {
              width: 'auto',
              height: '40px',
              left: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'ew-resize',
            },
            right: {
              width: 'auto',
              height: '40px',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'ew-resize',
            },
          }}
          resizeHandleComponent={{
            left: <div className="h-10 w-1.5 rounded-full bg-white border border-border shadow-[0_0_4px_rgba(0,0,0,0.3)]" />,
            right: <div className="h-10 w-1.5 rounded-full bg-white border border-border shadow-[0_0_4px_rgba(0,0,0,0.3)]" />,
          }}
          className={cn('rounded-sm overflow-hidden')}
        >
          <iframe
            title={provider?.meta?.title ?? `Embedded content from ${provider?.type ?? 'unknown'}`}
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            style={{
              aspectRatio: `${sizes.width} / ${sizes.height}`,
            }}
          />
        </Rnd>
        {isSelected && (
          <EmbedInlineToolbar
            referenceRef={embedContainerRef}
            elementProps={elementProps}
            onUpdate={onUpdate}
            onReplace={onReplace}
            onDelete={onDelete}
            onCopy={copyEmbed}
          />
        )}
      </div>
      {children}
    </div>
  );
};

