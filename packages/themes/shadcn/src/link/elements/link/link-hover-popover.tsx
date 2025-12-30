import { useEffect, useRef, useState } from 'react';
import type { LinkElementProps } from '@yoopta/link';
import copy from 'copy-to-clipboard';
import { Check, Copy, Edit2, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

import { LinkHoverEdit } from './link-hover-edit';
import { Button } from '../../../ui/button';
import { cn } from '../../../utils';

type LinkHoverPopoverProps = {
  elementProps: LinkElementProps;
  linkText: string;
  onUpdate: (props: Partial<LinkElementProps>, newText?: string) => void;
  onDelete: () => void;
  children: React.ReactNode;
};

export const LinkHoverPopover = ({
  elementProps,
  linkText,
  onUpdate,
  onDelete,
  children,
}: LinkHoverPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrl, setEditedUrl] = useState(elementProps.url ?? '');
  const [editedText, setEditedText] = useState(linkText);
  const [copied, setCopied] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEditedUrl(elementProps.url ?? '');
    setEditedText(linkText);
  }, [elementProps.url, linkText]);

  useEffect(() => {
    if (isEditing && urlInputRef.current) {
      urlInputRef.current.focus();
      urlInputRef.current.select();
    }
  }, [isEditing]);

  const onMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const onMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsEditing(false);
    }, 150);
  };

  const openLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (elementProps.url) {
      window.open(elementProps.url, elementProps.target ?? '_blank', elementProps.rel);
    }
  };

  const copyUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (elementProps.url) {
      const success = copy(elementProps.url);
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
    onUpdate({ url: editedUrl }, editedText);
    setIsEditing(false);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditedUrl(elementProps.url ?? '');
    setEditedText(linkText);
    setIsEditing(false);
  };

  const deleteLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
    setIsEditing(false);
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onUpdate({ url: editedUrl }, editedText);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setEditedUrl(elementProps.url ?? '');
      setEditedText(linkText);
      setIsEditing(false);
    }
  };

  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(
    null,
  );

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    } else {
      setPopoverPosition(null);
    }
  }, [isOpen]);

  const popoverContent =
    isOpen && popoverPosition ? (
      <div
        className={cn(
          'fixed z-50',
          'rounded-lg border bg-popover px-2 py-1 shadow-lg',
          'transition-all duration-200 ease-out',
          'opacity-100 translate-y-0',
        )}
        style={{
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
          transform: 'translate(-50%, -100%)',
          minWidth: '280px',
          maxWidth: '400px',
        }}
        contentEditable={false}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <LinkHoverEdit
            textInputRef={textInputRef}
            urlInputRef={urlInputRef}
            editedText={editedText}
            editedUrl={editedUrl}
            onChangeLinkText={(e) => setEditedText(e.target.value)}
            onChangeLinkUrl={(e) => setEditedUrl(e.target.value)}
            onKeyDown={onKeyDown}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            deleteLink={deleteLink}
          />
        ) : (
          <div className="flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-mono truncate text-foreground">
                {elementProps.url ?? 'No URL'}
              </div>
            </div>
            <div className="h-4 w-px bg-border" />
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={openLink}
              disabled={!elementProps.url}
              title="Open link">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={copyUrl}
              disabled={!elementProps.url}
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
        )}
      </div>
    ) : null;

  return (
    <>
      <span
        ref={containerRef}
        className="relative inline-block group/link"
        contentEditable={false}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        {children}
      </span>
      {typeof document !== 'undefined' && createPortal(popoverContent, document.body)}
    </>
  );
};
