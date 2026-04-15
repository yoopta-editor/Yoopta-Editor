import { useEffect, useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Elements, useYooptaEditor, useYooptaReadOnly } from '@yoopta/editor';
import type { MathInlineElementProps } from '@yoopta/math';
import { renderLatexToHTML } from '@yoopta/math';
import copy from 'copy-to-clipboard';

import { MathEdit } from './math-edit';
import { MathPreview } from './math-preview';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../ui/hover-card';
import { cn } from '../../../utils';

export const MathElement = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const isReadOnly = useYooptaReadOnly();

  const { latex } = element.props as MathInlineElementProps;

  const [isEditing, setIsEditing] = useState(false);
  const [editedLatex, setEditedLatex] = useState(latex ?? '');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedLatex(latex ?? '');
  }, [latex]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const openEdit = (e: React.MouseEvent) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const saveEdit = (e: React.MouseEvent) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const elementPath = Elements.getElementPath(editor, {
      blockId,
      element,
    });

    if (!elementPath) return;

    Elements.updateElement(editor, {
      blockId,
      type: 'math-inline',
      path: elementPath,
      props: { latex: editedLatex },
    });
    setIsEditing(false);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditedLatex(latex ?? '');
    setIsEditing(false);
  };

  const deleteMath = (e: React.MouseEvent) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const elementPath = Elements.getElementPath(editor, {
      blockId,
      element,
    });

    if (!elementPath) return;

    Elements.deleteElement(editor, {
      type: 'math-inline',
      path: elementPath,
      blockId,
    });
    setIsEditing(false);
  };

  const copyLatex = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (latex) {
      const success = copy(latex);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      e.stopPropagation();

      const elementPath = Elements.getElementPath(editor, {
        blockId,
        element,
      });

      if (!elementPath) return;

      Elements.updateElement(editor, {
        blockId,
        type: 'math-inline',
        path: elementPath,
        props: { latex: editedLatex },
      });
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setEditedLatex(latex ?? '');
      setIsEditing(false);
    }
  };

  const renderedHtml = renderLatexToHTML(latex || '?', false);
  const hasError = !latex || latex.trim() === '';

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span
          {...attributes}
          contentEditable={false}
          data-math-inline
          data-latex={latex}
          className={cn(
            'inline-flex items-center align-baseline',
            'transition-colors cursor-pointer',
            hasError
              ? 'bg-destructive/10 text-destructive'
              : 'bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-500/15',
          )}
          style={{
            borderRadius: '0.25rem',
            padding: '0.1em 0.35em',
            margin: '0 0.1em',
            fontSize: '0.95em',
            lineHeight: 1.4,
            verticalAlign: 'baseline',
          }}
        >
          <span dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          {children}
        </span>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-80 p-0"
        side="top"
        align="start"
        sideOffset={8}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {!isReadOnly && isEditing ? (
          <MathEdit
            textareaRef={textareaRef}
            editedLatex={editedLatex}
            onChangeLatex={(e) => setEditedLatex(e.target.value)}
            onKeyDown={onKeyDown}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            deleteMath={deleteMath}
          />
        ) : (
          <MathPreview
            latex={latex}
            openEdit={openEdit}
            copyLatex={copyLatex}
            copied={copied}
          />
        )}
      </HoverCardContent>
    </HoverCard>
  );
};
