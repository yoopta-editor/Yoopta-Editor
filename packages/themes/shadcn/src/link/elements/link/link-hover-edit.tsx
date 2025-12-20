import { Trash2 } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';

type LinkHoverEditProps = {
  textInputRef: React.RefObject<HTMLInputElement>;
  urlInputRef: React.RefObject<HTMLInputElement>;
  editedText: string;
  editedUrl: string;
  onChangeLinkText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLinkUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  saveEdit: (e: React.MouseEvent) => void;
  cancelEdit: (e: React.MouseEvent) => void;
  deleteLink: (e: React.MouseEvent) => void;
};

const LinkHoverEdit = ({
  textInputRef,
  urlInputRef,
  editedText,
  editedUrl,
  onChangeLinkText,
  onChangeLinkUrl,
  onKeyDown,
  saveEdit,
  cancelEdit,
  deleteLink,
}: LinkHoverEditProps) => (
  <div className="space-y-2">
    <div className="space-y-1.5">
      <Label htmlFor="link-text" className="text-xs">
        Link text
      </Label>
      <Input
        id="link-text"
        ref={textInputRef}
        value={editedText}
        onChange={onChangeLinkText}
        placeholder="Link text..."
        className="h-8 text-sm"
      />
    </div>
    <div className="space-y-1.5">
      <Label htmlFor="link-url" className="text-xs">
        URL
      </Label>
      <Input
        id="link-url"
        ref={urlInputRef}
        value={editedUrl}
        onChange={onChangeLinkUrl}
        onKeyDown={onKeyDown}
        placeholder="Enter URL..."
        className="h-8 text-sm"
      />
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="default" className="h-7 text-xs" onClick={saveEdit}>
          Save
        </Button>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={cancelEdit}>
          Cancel
        </Button>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={deleteLink}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
);

export { LinkHoverEdit };
