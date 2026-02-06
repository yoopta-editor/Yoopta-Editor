'use client';

import { useState } from 'react';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { useYooptaEditor } from '@yoopta/editor';
import {
  type TableOfContentsEditor,
  type TableOfContentsElementProps,
  type TableOfContentsItem,
  useTableOfContentsItems,
} from '@yoopta/table-of-contents';
import { ElementOptions } from '@yoopta/ui/element-options';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { cn } from '../../utils';
import { TocElementOptions } from '../components/toc-element-options';

/** Build hierarchical numbers (1, 1.1, 1.2, 2, 2.1, …) for nested TOC items */
function getNumbering(items: TableOfContentsItem[]): string[] {
  const numbers: string[] = [];
  const c = [0, 0, 0];
  for (const item of items) {
    const level = item.level;
    if (level === 1) {
      c[0] += 1;
      c[1] = 0;
      c[2] = 0;
    } else if (level === 2) {
      c[1] += 1;
      c[2] = 0;
    } else if (level === 3) {
      c[2] += 1;
    }
    numbers.push(c.slice(0, level).join('.'));
  }
  return numbers;
}

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
  const numbering = getNumbering(items);

  return (
    <div {...props.attributes} contentEditable={false} className="group relative mt-4">
      <ElementOptions.Root blockId={blockId} element={element}>
        <ElementOptions.Trigger
          className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-accent"
        />
        <TocElementOptions />
      </ElementOptions.Root>
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
              <ScrollArea className="max-h-[280px] pr-3 overflow-y-auto">
                <ol
                  className="space-y-1"
                  data-show-numbers={showNumbers}
                  style={{
                    listStyle: 'none',
                    paddingLeft: 0,
                  }}>
                  {items.map((item, index) => (
                    <li
                      key={item.id}
                      data-level={item.level}
                      className={cn(
                        'leading-tight flex gap-2',
                        item.level === 1 && 'font-medium',
                        item.level === 2 && 'pl-3 text-sm',
                        item.level === 3 && 'pl-6 text-sm text-muted-foreground',
                      )}>
                      {showNumbers ? (
                        <span className="shrink-0 text-muted-foreground" aria-hidden>
                          {numbering[index]}.
                        </span>
                      ) : null}
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto min-w-0 flex-1 justify-start p-0 text-left font-inherit text-inherit no-underline hover:underline"
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
