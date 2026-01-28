import { useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Elements, useYooptaEditor } from '@yoopta/editor';
import type { MentionElementProps, MentionType } from '@yoopta/mention';
import copy from 'copy-to-clipboard';
import { AtSign, Check, Copy, ExternalLink, FileText, Hash, Mail, Trash2 } from 'lucide-react';

import { MentionAvatar } from './mention-avatar';
import { Button } from '../../../ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../ui/hover-card';
import { cn } from '../../../utils';
import { DEFAULT_TYPE_COLORS } from '../../types';

type MentionMeta = {
  url?: string;
  description?: string;
  email?: string;
  [key: string]: unknown;
};

const TypeIcon = ({ type }: { type?: MentionType }) => {
  const iconClass = 'w-3.5 h-3.5';
  switch (type) {
    case 'user':
      return <AtSign className={iconClass} />;
    case 'channel':
      return <Hash className={iconClass} />;
    case 'page':
      return <FileText className={iconClass} />;
    default:
      return <AtSign className={iconClass} />;
  }
};

export const MentionElement = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const [copied, setCopied] = useState(false);

  const { id, name, avatar, type, meta } = element.props as MentionElementProps<MentionMeta>;
  const typeColor = type ? DEFAULT_TYPE_COLORS[type] ?? DEFAULT_TYPE_COLORS.custom : null;
  const mentionUrl = meta?.url;
  const description = meta?.description;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const mentionPath = Elements.getElementPath(editor, {
      blockId,
      element,
    });

    if (!mentionPath) return;

    Elements.deleteElement(editor, {
      type: 'mention',
      path: mentionPath,
      blockId,
    });
  };

  const handleOpenUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (mentionUrl) {
      window.open(mentionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const textToCopy = mentionUrl ?? `@${name}`;
    const success = copy(textToCopy);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (mentionUrl && e.metaKey) {
      handleOpenUrl(e);
    }
  };

  return (
    <HoverCard openDelay={300} closeDelay={150}>
      <HoverCardTrigger asChild>
        <span
          {...attributes}
          contentEditable={false}
          onClick={handleClick}
          data-mention-id={id}
          data-mention-type={type}
          className={cn(
            'inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-md',
            'bg-primary/10 text-primary font-medium',
            'hover:bg-primary/15 transition-colors cursor-pointer',
            'align-baseline',
          )}>
          <MentionAvatar name={name} avatar={avatar} size="inline" />
          <span className="ml-0.5">{name}</span>
          {children}
        </span>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-80 p-0 overflow-hidden"
        side="top"
        align="start"
        sideOffset={8}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        {/* Gradient header background */}
        <div className="h-12 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

        {/* Profile section - overlapping the header */}
        <div className="px-4 -mt-6">
          <div className="flex items-end gap-3">
            {/* Avatar with border */}
            <div className="rounded-full bg-background p-0.5 shadow-sm">
              <MentionAvatar name={name} avatar={avatar} size="lg" />
            </div>

            {/* Name and type badge */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-base truncate">{name}</h4>
                {type && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium',
                      typeColor,
                    )}>
                    <TypeIcon type={type} />
                    {type}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description and email */}
          <div className="mt-3 space-y-2">
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            )}

            {meta?.email && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{meta.email}</span>
              </div>
            )}

            {mentionUrl && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="truncate">{mentionUrl}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 p-2 mt-3 border-t bg-muted/30">
          {mentionUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs flex-1 hover:bg-background"
              onClick={handleOpenUrl}>
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Open link
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs flex-1 hover:bg-background"
            onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
