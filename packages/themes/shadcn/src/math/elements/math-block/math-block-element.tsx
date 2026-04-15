import { useEffect, useRef, useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Elements, useYooptaEditor, useYooptaReadOnly } from '@yoopta/editor';
import type { MathBlockElementProps } from '@yoopta/math';
import { renderLatexToHTML } from '@yoopta/math';
import copy from 'copy-to-clipboard';
import { Check, Copy, Edit2, Trash2 } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { cn } from '../../../utils';

export const MathBlockElement = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const isReadOnly = useYooptaReadOnly();

  const { latex } = element.props as MathBlockElementProps;

  const [isEditing, setIsEditing] = useState(!latex);
  const [editedLatex, setEditedLatex] = useState(latex ?? '');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedLatex(latex ?? '');
  }, [latex]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const saveEdit = () => {
    if (isReadOnly) return;

    const elementPath = Elements.getElementPath(editor, { blockId, element });
    if (!elementPath) return;

    Elements.updateElement(editor, {
      blockId,
      type: 'math-block',
      path: elementPath,
      props: { latex: editedLatex },
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedLatex(latex ?? '');
    if (latex) setIsEditing(false);
  };

  const deleteMathBlock = () => {
    if (isReadOnly) return;
    editor.deleteBlock({ blockId });
  };

  const copyLatex = () => {
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
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      cancelEdit();
    }
  };

  const renderedHtml = renderLatexToHTML(latex || '', true);
  const previewHtml = renderLatexToHTML(editedLatex || '', true);
  const hasLatex = !!latex && latex.trim() !== '';

  return (
    <div
      {...attributes}
      contentEditable={false}
      data-math-block
      data-latex={latex}
      className={cn(
        'rounded-lg transition-colors my-2 hover:bg-violet-500/5',
        isEditing
          ? 'border-violet-500/40 bg-violet-500/5'
          : hasLatex
            ? 'bg-card hover:border-violet-500/30 cursor-pointer'
            : 'bg-muted/20 cursor-pointer',
      )}
    >
      {isEditing && !isReadOnly ? (
        <div>
          {/* Live preview */}
          <div className="px-2 py-2 flex items-center justify-center bg-muted/10">
            {editedLatex.trim() ? (
              <span
                className="text-lg text-foreground"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <span className="text-sm text-muted-foreground italic">
                Type a LaTeX expression below...
              </span>
            )}
          </div>

          {/* Editor */}
          <div className="p-3 space-y-2">
            <div className="space-y-1">
              <Label htmlFor="math-block-latex" className="text-xs">
                LaTeX Expression
              </Label>
              <textarea
                id="math-block-latex"
                ref={textareaRef}
                value={editedLatex}
                onChange={(e) => setEditedLatex(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="e.g. \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y min-h-[60px]"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
              <p className="text-[10px] text-muted-foreground">
                {/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl'}+Enter to save, Esc to
                cancel
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 text-xs"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    saveEdit();
                  }}
                  disabled={!editedLatex.trim()}
                >
                  Save
                </Button>
                {hasLatex && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      cancelEdit();
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteMathBlock();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isReadOnly && setIsEditing(true)}
          className="relative group"
        >
          {/* Rendered math */}
          <div className="px-2 py-2 flex items-center justify-center">
            {hasLatex ? (
              <span
                className="text-lg text-foreground"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            ) : (
              <span className="text-sm text-muted-foreground italic">
                Click to add a math equation
              </span>
            )}
          </div>

          {/* Hover actions */}
          {hasLatex && (
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  copyLatex();
                }}
                title={copied ? 'Copied!' : 'Copy LaTeX'}
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              {!isReadOnly && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  title="Edit expression"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
