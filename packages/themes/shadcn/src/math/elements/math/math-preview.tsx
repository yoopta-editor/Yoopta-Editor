import { useYooptaReadOnly } from '@yoopta/editor';
import { renderLatexToHTML } from '@yoopta/math';
import { Check, Copy, Edit2 } from 'lucide-react';

import { Button } from '../../../ui/button';

type MathPreviewProps = {
  latex: string;
  openEdit: (e: React.MouseEvent) => void;
  copyLatex: (e: React.MouseEvent) => void;
  copied: boolean;
};

export const MathPreview = ({
  latex,
  openEdit,
  copyLatex,
  copied,
}: MathPreviewProps) => {
  const isReadOnly = useYooptaReadOnly();
  const renderedHtml = renderLatexToHTML(latex || '', false);

  return (
    <div>
      {/* Rendered math preview */}
      <div className="px-3 py-2.5 flex items-center justify-center min-h-[40px] border-b">
        {latex ? (
          <span
            className="text-base text-foreground"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        ) : (
          <span className="text-sm text-muted-foreground italic">Empty expression</span>
        )}
      </div>

      {/* LaTeX source */}
      <div className="px-3 py-1.5 border-b bg-muted/30">
        <code className="text-xs text-muted-foreground font-mono break-all">
          {latex || '—'}
        </code>
      </div>

      {/* Actions */}
      <div className="px-2 py-1">
        <div className="flex items-center gap-1">
          <div className="flex-1 min-w-0">
            <span className="text-xs text-muted-foreground">Inline Math</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={copyLatex}
            title={copied ? 'Copied!' : 'Copy LaTeX'}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          {!isReadOnly && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={openEdit}
              title="Edit expression"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
