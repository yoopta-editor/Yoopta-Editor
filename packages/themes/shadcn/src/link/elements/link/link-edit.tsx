import { Trash2 } from 'lucide-react';

import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';

type LinkEditProps = {
  textInputRef: React.RefObject<HTMLInputElement>;
  urlInputRef: React.RefObject<HTMLInputElement>;
  editedText: string;
  editedUrl: string;
  onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  saveEdit: (e: React.MouseEvent) => void;
  cancelEdit: (e: React.MouseEvent) => void;
  deleteLink: (e: React.MouseEvent) => void;
};

export const LinkEdit = ({
  textInputRef,
  urlInputRef,
  editedText,
  editedUrl,
  onChangeText,
  onChangeUrl,
  onKeyDown,
  saveEdit,
  cancelEdit,
  deleteLink,
}: LinkEditProps) => (
  <div className="p-3 space-y-3">
    <div className="space-y-1.5">
      <Label htmlFor="link-text" className="text-xs">
        Link text
      </Label>
      <Input
        id="link-text"
        ref={textInputRef}
        value={editedText}
        onChange={onChangeText}
        placeholder="Link text..."
        className="h-8 text-sm"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
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
        onChange={onChangeUrl}
        onKeyDown={onKeyDown}
        placeholder="Enter URL..."
        className="h-8 text-sm"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="default"
          className="h-7 text-xs"
          onClick={saveEdit}
          disabled={editedUrl.length === 0 || editedText.length === 0}>
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
