import { renderLatexToHTML } from '@yoopta/math';
import { Trash2 } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';

type MathEditProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  editedLatex: string;
  onChangeLatex: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  saveEdit: (e: React.MouseEvent) => void;
  cancelEdit: (e: React.MouseEvent) => void;
  deleteMath: (e: React.MouseEvent) => void;
};

export const MathEdit = ({
  textareaRef,
  editedLatex,
  onChangeLatex,
  onKeyDown,
  saveEdit,
  cancelEdit,
  deleteMath,
}: MathEditProps) => {
  const previewHtml = renderLatexToHTML(editedLatex || '', false);
  const hasContent = editedLatex.trim().length > 0;

  return (
    <div>
      {/* Live preview */}
      <div className="px-3 py-2.5 flex items-center justify-center min-h-[40px] border-b bg-muted/20">
        {hasContent ? (
          <span
            className="text-base text-foreground"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <span className="text-sm text-muted-foreground italic">Type LaTeX below...</span>
        )}
      </div>

      {/* LaTeX input */}
      <div className="p-2 space-y-2">
        <div className="space-y-1">
          <Label htmlFor="math-latex" className="text-xs">
            LaTeX Expression
          </Label>
          <textarea
            id="math-latex"
            ref={textareaRef}
            value={editedLatex}
            onChange={onChangeLatex}
            onKeyDown={onKeyDown}
            placeholder="e.g. E = mc^2"
            rows={2}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="text-[10px] text-muted-foreground">
            {/Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl'}+Enter to save, Esc to cancel
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="h-7 text-xs"
              onClick={saveEdit}
              disabled={!hasContent}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={deleteMath}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
