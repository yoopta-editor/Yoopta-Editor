'use client';

import { useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useYooptaEditor } from '@yoopta/editor';
import {
  type TableOfContentsEditor,
  type TableOfContentsElementProps,
  useTableOfContentsItems,
} from '@yoopta/table-of-contents';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { cn } from '../../utils';

const defaultTocProps: TableOfContentsElementProps = {
  depth: 3,
  title: 'Table of Contents',
  headingTypes: ['HeadingOne', 'HeadingTwo', 'HeadingThree'],
  showNumbers: false,
  collapsible: false,
};

export const TableOfContents = (props: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const { blockId, element } = props;
  const tocProps = (element.props ?? defaultTocProps) as TableOfContentsElementProps;
  const {
    depth = 3,
    title = defaultTocProps.title,
    headingTypes = defaultTocProps.headingTypes ?? [],
    showNumbers = true,
    collapsible = true,
  } = tocProps;

  const [isExpanded, setIsExpanded] = useState(true);
  const items = useTableOfContentsItems(editor as TableOfContentsEditor, blockId, {
    depth,
    headingTypes,
  });

  const handleItemClick = (targetBlockId: string) => {
    editor.focusBlock(targetBlockId);
    setTimeout(() => {
      const blockEl = document.querySelector(`[data-yoopta-block-id="${targetBlockId}"]`);
      blockEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 100);
  };

  const showContent = !collapsible || isExpanded;

  return (
    <div {...props.attributes} contentEditable={false}>
      <Card
        className="w-full overflow-hidden"
        role="navigation"
        aria-label={title ?? 'Table of contents'}>
        {title ? (
          <CardHeader className="pb-4 pt-4">
            <div className="flex items-center gap-1">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              {collapsible ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  aria-expanded={isExpanded}
                  onClick={() => setIsExpanded((v) => !v)}>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              ) : null}
            </div>
          </CardHeader>
        ) : collapsible ? (
          <CardHeader className="pb-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((v) => !v)}>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
        ) : null}
        {showContent ? (
          <CardContent className={cn('pt-0', title || collapsible ? 'pb-4' : 'py-4')}>
            {items.length > 0 ? (
              <ScrollArea className="max-h-[280px] pr-3">
                <ol
                  className="space-y-1"
                  data-show-numbers={showNumbers}
                  style={{
                    listStyle: showNumbers ? 'decimal' : 'none',
                    paddingLeft: showNumbers ? 20 : 0,
                  }}>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      data-level={item.level}
                      className={cn(
                        'leading-tight',
                        item.level === 1 && 'font-medium',
                        item.level === 2 && 'pl-3 text-sm',
                        item.level === 3 && 'pl-6 text-sm text-muted-foreground',
                      )}>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto justify-start p-0 text-left font-inherit text-inherit no-underline hover:underline"
                        onClick={() => handleItemClick(item.id)}>
                        {item.text || '(Untitled)'}
                      </Button>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No headings in this document.</p>
            )}
          </CardContent>
        ) : null}
      </Card>
      {props.children}
    </div>
  );
};
