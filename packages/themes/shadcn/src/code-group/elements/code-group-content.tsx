import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CodeGroupCommands,
  HighlightedCodeOverlay,
  SHIKI_CODE_LANGUAGES,
  isLanguageSupported,
} from '@yoopta/code';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import copy from 'copy-to-clipboard';
import { Check, Copy, Sparkles, Trash2 } from 'lucide-react';
import { Editor, Element, Text } from 'slate';

import { LanguageSelect } from '../../code/elements/language-select';
import { Button } from '../../ui/button';
import { TabsContent } from '../../ui/tabs';

const getNodeText = (node: unknown): string => {
  if (Text.isText(node)) {
    return node.text;
  }
  if (typeof node === 'object' && node !== null && 'children' in node) {
    const children = (node as { children?: unknown[] }).children;
    return children?.map(getNodeText).join('\n') ?? '';
  }
  return '';
};

type ThemeColors = {
  buttonForeground: string;
};

export const CodeGroupContent = (props: PluginElementRenderProps) => {
  const { attributes, children, element, blockId } = props;
  const overlayRef = useRef<HTMLDivElement>(null);
  const editor = useYooptaEditor();

  const language = element?.props?.language ?? 'javascript';
  const theme = useMemo(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return 'github-dark';
    const codeGroupNodes = Array.from(
      Editor.nodes(slate, {
        at: [0],
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'code-group-container',
      }),
    )?.[0];

    if (!codeGroupNodes) return 'github-dark';

    const [codeGroupElement] = codeGroupNodes;
    if (!codeGroupElement) return 'github-dark';

    return (codeGroupElement as SlateElement).props?.theme ?? 'github-dark';
  }, [editor, blockId]);

  const [copied, setCopied] = useState(false);
  const [isBeautifying, setIsBeautifying] = useState(false);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    buttonForeground: '',
  });

  useEffect(() => {
    if (window.yShiki) {
      const themeData = window.yShiki.getTheme(theme);

      setThemeColors({
        buttonForeground:
          themeData.colors?.['button.foreground'] ??
          themeData.colors?.['icon.foreground'] ??
          themeData.fg,
      });
    }
  }, [theme]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.currentTarget.scrollTop;
      overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const copyCode = () => {
    const codeText = getNodeText(element);
    const success = copy(codeText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const deleteCodeElement = () => {
    if (editor.readOnly) return;
    CodeGroupCommands.deleteTabItem(editor, blockId, { tabId: element.props?.referenceId });
  };

  const updateLanguage = (newLanguage: string) => {
    if (editor.readOnly) return;
    const elementPath = Elements.getElementPath(editor, { blockId, element });
    if (!elementPath) return;

    Elements.updateElement(editor, {
      blockId,
      type: 'code-group-content',
      props: {
        ...element.props,
        language: newLanguage,
      },
      path: elementPath,
    });
  };

  const beautifyCode = async () => {
    if (isBeautifying) return;
    const tabId = element.props?.referenceId;
    if (!tabId) return;

    setIsBeautifying(true);
    try {
      await CodeGroupCommands.beautifyTab(editor, blockId, tabId);
    } finally {
      setIsBeautifying(false);
    }
  };

  const canBeautify = isLanguageSupported(language);

  const currentLanguage =
    SHIKI_CODE_LANGUAGES.find((lang) => lang.value === language) ?? SHIKI_CODE_LANGUAGES[0];

  return (
    <TabsContent
      {...attributes}
      value={element.props?.referenceId}
      className="rounded-b-lg mt-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0">
      <div className="relative group/code-group-content overflow-hidden">
        <div
          contentEditable={false}
          className="absolute top-2 right-2 z-20 flex items-center gap-2 opacity-0 group-hover/code-group-content:opacity-100 transition-opacity"
          style={{
            backgroundColor: 'var(--code-group-tab-active-bg)',
            padding: '4px',
            borderRadius: '4px',
          }}>
          <LanguageSelect
            value={language}
            options={SHIKI_CODE_LANGUAGES}
            onValueChange={updateLanguage}
            currentLabel={currentLanguage.label}
          />
          {canBeautify && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={beautifyCode}
              disabled={isBeautifying}
              title="Beautify code"
              style={{
                color: themeColors.buttonForeground || 'var(--code-group-tab-active-fg)',
              }}>
              <Sparkles className={`h-4 w-4 ${isBeautifying ? 'animate-pulse' : ''}`} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={copyCode}
            title={copied ? 'Copied!' : 'Copy code'}
            style={{
              color: themeColors.buttonForeground || 'var(--code-group-tab-active-fg)',
            }}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          {!editor.readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={deleteCodeElement}
              title="Delete code"
              style={{
                color: themeColors.buttonForeground || 'var(--code-group-tab-active-fg)',
              }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div
          className="relative bg-background overflow-hidden rounded-lg"
          style={{
            backgroundColor: 'var(--code-group-editor-bg)',
            color: 'var(--code-group-editor-fg)',
            caretColor: 'var(--code-group-editor-cursor)',
          }}>
          <div
            ref={overlayRef}
            className="absolute inset-0 p-4 font-mono text-sm whitespace-pre overflow-auto pointer-events-none z-10 select-none"
            style={{
              lineHeight: '1.6',
              tabSize: 2,
            }}
            contentEditable={false}
            aria-hidden="true">
            <HighlightedCodeOverlay element={element} language={language} theme={theme} />
          </div>

          <div
            className="relative p-4 font-mono text-sm whitespace-pre overflow-auto"
            style={{
              lineHeight: '1.6',
              tabSize: 2,
              color: 'transparent',
              caretColor: 'var(--code-group-editor-cursor)',
            }}
            onScroll={handleScroll}>
            {children}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
