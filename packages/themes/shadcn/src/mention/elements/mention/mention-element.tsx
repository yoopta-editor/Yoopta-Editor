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
    if (editor.readOnly) return;
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
        <span className={cn(
          'bg-primary/10 text-primary font-medium',
          'hover:bg-primary/15 transition-colors cursor-pointer',
        )}
          style={{
            borderRadius: '0.25em',
          }}>
          <span
            {...attributes}
            contentEditable={false}
            onClick={handleClick}
            data-mention-id={id}
            data-mention-type={type}
            className="inline-flex items-center align-baseline"
            style={{
              padding: '0.25em',
              margin: '0 0.15em',
              gap: '0.25em',
              fontSize: '0.85em',
              lineHeight: 'inherit',
              height: 0
            }}>
            <MentionAvatar name={name} avatar={avatar} size="inline" />
            <span style={{ marginLeft: '0.15em' }}>{name}</span>
            {children}
          </span>
        </span>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-72 p-0"
        side="top"
        align="start"
        sideOffset={8}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}>
        {/* Header with avatar and name */}
        <div className="p-2">
          <div className="flex items-start gap-3">
            <MentionAvatar name={name} avatar={avatar} size="md" />
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm truncate">{name}</h4>
                {type && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-medium shrink-0',
                      typeColor,
                    )}>
                    <TypeIcon type={type} />
                    {type}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact info */}
        {(meta?.email || mentionUrl) && (
          <div className="px-2 pb-2 space-y-1">
            {meta?.email && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{meta.email}</span>
              </div>
            )}
            {mentionUrl && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{mentionUrl}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 p-1 border-t">
          {mentionUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs flex-1"
              onClick={handleOpenUrl}>
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Open
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs flex-1"
            onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy
              </>
            )}
          </Button>

          {!editor.readOnly && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              title="Delete mention">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
