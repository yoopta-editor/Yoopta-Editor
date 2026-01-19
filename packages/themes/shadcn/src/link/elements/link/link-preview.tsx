import type { SlateElement } from '@yoopta/editor';
import { Check, Copy, Edit2, ExternalLink } from 'lucide-react';

import { Button } from '../../../ui/button';

type LinkPreviewProps = {
  element: SlateElement;
  openLink: (e: React.MouseEvent) => void;
  copyUrl: (e: React.MouseEvent) => void;
  openEdit: (e: React.MouseEvent) => void;
  copied: boolean;
};

export const LinkPreview = ({ element, openLink, copyUrl, openEdit, copied }: LinkPreviewProps) => (
  <div className="px-2 py-1">
    <div className="flex items-center gap-1">
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate text-foreground">{element.props.url ?? 'No URL'}</div>
      </div>
      <div className="h-4 w-px bg-border" />
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0"
        onClick={openLink}
        disabled={!element.props.url}
        title="Open link">
        <ExternalLink className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 w-7 p-0"
        onClick={copyUrl}
        disabled={!element.props.url}
        title={copied ? 'Copied!' : 'Copy URL'}>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={openEdit} title="Edit URL">
        <Edit2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);
