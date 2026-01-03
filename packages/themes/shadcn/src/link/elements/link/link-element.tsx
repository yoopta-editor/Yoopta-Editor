import { useEffect, useRef, useState } from 'react';
import { Elements, useYooptaEditor } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import copy from 'copy-to-clipboard';
import { Check, Copy, Edit2, ExternalLink, Trash2 } from 'lucide-react';
import { Text } from 'slate';

import { Button } from '../../../ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../ui/hover-card';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';

const getNodeText = (node: unknown): string => {
  if (Text.isText(node)) {
    return node.text;
  }
  if (typeof node === 'object' && node !== null && 'children' in node) {
    const children = (node as { children?: unknown[] }).children;
    return children?.map(getNodeText).join('') ?? '';
  }
  return '';
};

const Link = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const linkText = getNodeText(element);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(element.props.url ?? '');
  const [editedText, setEditedText] = useState(linkText);
  const [copied, setCopied] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedUrl(element.props.url ?? '');
    setEditedText(linkText);
  }, [element.props.url, linkText]);

  useEffect(() => {
    if (isEditing && urlInputRef.current) {
      urlInputRef.current.focus();
      urlInputRef.current.select();
    }
  }, [isEditing]);

  const openLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (element.props.url) {
      window.open(element.props.url, element.props.target ?? '_blank', element.props.rel);
    }
  };

  const copyUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (element.props.url) {
      const success = copy(element.props.url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }
  };

  const editUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const saveEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    Elements.updateElement(editor, {
      blockId,
      type: 'link',
      text: editedText,
      props: {
        url: editedUrl,
      },
    });
    setIsEditing(false);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditedUrl(element.props.url ?? '');
    setEditedText(linkText);
    setIsEditing(false);
  };

  const handleDeleteLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    Elements.deleteElement(editor, {
      mode: 'unwrap',
      type: 'link',
      blockId,
    });
    setIsEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      Elements.updateElement(editor, {
        blockId,
        type: 'link',
        text: editedText,
        props: {
          url: editedUrl,
        },
      });
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setEditedUrl(element.props.url ?? '');
      setEditedText(linkText);
      setIsEditing(false);
    }
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          {...attributes}
          href={element.props.url || undefined}
          target={element.props.target}
          rel={element.props.rel}
          title={element.props.title || undefined}
          className="text-primary font-medium underline underline-offset-4 cursor-pointer hover:text-primary/80 transition-colors"
          contentEditable={false}
          onClick={(e) => {
            // Prevent navigation when clicking in edit mode
            if (isEditing) {
              e.preventDefault();
            }
          }}>
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <div className="p-3 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="link-text" className="text-xs">
                Link text
              </Label>
              <Input
                id="link-text"
                ref={textInputRef}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
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
                onChange={(e) => setEditedUrl(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Enter URL..."
                className="h-8 text-sm"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
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
                onClick={handleDeleteLink}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-mono truncate text-foreground">
                  {element.props.url ?? 'No URL'}
                </div>
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
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={editUrl}
                title="Edit URL">
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export { Link };
