import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CodeCommands,
  HighlightedCodeOverlay,
  SHIKI_CODE_LANGUAGES,
  SHIKI_CODE_THEMES,
  isLanguageSupported,
} from '@yoopta/code';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import copy from 'copy-to-clipboard';
import { Check, Copy, Sparkles, Trash2 } from 'lucide-react';
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { Editor, Element, Text } from 'slate';

import { LanguageSelect } from './language-select';
import { ThemeSelect } from './theme-select';
import { Button } from '../../ui/button';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    yShiki: HighlighterGeneric<BundledLanguage, BundledTheme> | null;
  }
}

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
  background: string;
  foreground: string;
  caret: string;
  tabActiveBackground: string;
  tabInactiveBackground: string;
  tabActiveForeground: string;
  tabInactiveForeground: string;
  buttonForeground: string;
  selectBackground: string;
  selectForeground: string;
  borderColor: string;
};

export const CodeBlockElement = ({
  attributes,
  children,
  element,
  blockId,
}: PluginElementRenderProps) => {
  const editor = useYooptaEditor();
  const language = element.props?.language ?? 'javascript';
  const theme = element.props?.theme ?? 'github-dark';
  const overlayRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [isBeautifying, setIsBeautifying] = useState(false);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    background: '',
    foreground: '',
    caret: '',
    tabActiveBackground: '',
    tabInactiveBackground: '',
    tabActiveForeground: '',
    tabInactiveForeground: '',
    buttonForeground: '',
    selectBackground: '',
    selectForeground: '',
    borderColor: '',
  });

  useEffect(() => {
    if (window.yShiki) {
      const themeData = window.yShiki.getTheme(theme);
      const colors = themeData.colors ?? {};

      setThemeColors({
        background: colors['editor.background'] ?? themeData.bg,
        foreground: colors['editor.foreground'] ?? themeData.fg,
        caret: colors['editorCursor.foreground'] ?? themeData.fg,
        tabActiveBackground:
          colors['tab.activeBackground'] ?? colors['editorTab.activeBackground'] ?? themeData.bg,
        tabInactiveBackground:
          colors['tab.inactiveBackground'] ??
          colors['editorTab.inactiveBackground'] ??
          colors['editorGroupHeader.tabsBackground'] ??
          themeData.bg,
        tabActiveForeground:
          colors['tab.activeForeground'] ?? colors['editorTab.activeForeground'] ?? themeData.fg,
        tabInactiveForeground:
          colors['tab.inactiveForeground'] ??
          colors['editorTab.inactiveForeground'] ??
          colors['foreground'] ??
          themeData.fg,
        buttonForeground:
          colors['button.foreground'] ?? colors['icon.foreground'] ?? themeData.fg,
        selectBackground:
          colors['dropdown.background'] ?? colors['input.background'] ?? themeData.bg,
        selectForeground:
          colors['dropdown.foreground'] ?? colors['input.foreground'] ?? themeData.fg,
        borderColor:
          colors['dropdown.border'] ??
          colors['input.border'] ??
          colors['editorGroup.border'] ??
          'transparent',
      });
    }
  }, [theme]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.currentTarget.scrollTop;
      overlayRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const copyCode = useCallback(() => {
    const codeText = getNodeText(element);
    const success = copy(codeText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [element]);

  const deleteCodeElement = useCallback(() => {
    if (editor.readOnly) return;
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    const elementPath = Elements.getElementPath(editor, { blockId, element });
    if (!elementPath) return;

    const parentEntry = elementPath ? Editor.parent(slate, elementPath) : undefined;
    if (parentEntry && Element.isElement(parentEntry[0]) && !Editor.isEditor(parentEntry[0])) {
      Elements.deleteElement(editor, {
        blockId,
        type: 'code',
        path: elementPath,
      });
      return;
    }

    Blocks.deleteBlock(editor, { blockId, focus: true });
  }, [editor, blockId, element]);

  const updateLanguage = useCallback(
    (newLanguage: BundledLanguage) => {
      CodeCommands.updateCodeLanguage(editor, blockId, newLanguage);
    },
    [editor, blockId],
  );

  const updateTheme = useCallback(
    (newTheme: BundledTheme) => {
      CodeCommands.updateCodeTheme(editor, blockId, newTheme);
    },
    [editor, blockId],
  );

  const beautifyCode = useCallback(async () => {
    if (isBeautifying) return;

    setIsBeautifying(true);
    try {
      await CodeCommands.beautifyCode(editor, blockId);
    } finally {
      setIsBeautifying(false);
    }
  }, [editor, blockId, isBeautifying]);

  const canBeautify = isLanguageSupported(language);

  const currentLanguage =
    SHIKI_CODE_LANGUAGES.find((lang) => lang.value === language) ?? SHIKI_CODE_LANGUAGES[0];
  const currentTheme = SHIKI_CODE_THEMES.find((t) => t.value === theme) ?? SHIKI_CODE_THEMES[0];

  // CSS custom properties for scoped theming
  const cssVariables = {
    '--code-bg': themeColors.background,
    '--code-fg': themeColors.foreground,
    '--code-caret': themeColors.caret,
    '--code-tab-active-bg': themeColors.tabActiveBackground,
    '--code-tab-inactive-bg': themeColors.tabInactiveBackground,
    '--code-tab-active-fg': themeColors.tabActiveForeground,
    '--code-tab-inactive-fg': themeColors.tabInactiveForeground,
    '--code-button-fg': themeColors.buttonForeground,
    '--code-select-bg': themeColors.selectBackground,
    '--code-select-fg': themeColors.selectForeground,
    '--code-border': themeColors.borderColor,
  } as React.CSSProperties;

  return (
    <div
      {...attributes}
      className="relative my-2 group/code-block rounded-lg border overflow-hidden"
      style={{
        ...cssVariables,
        borderColor: themeColors.borderColor || undefined,
        backgroundColor: themeColors.tabInactiveBackground || undefined,
      }}>
      <div
        contentEditable={false}
        className="flex items-center justify-between px-4 py-2 border-b select-none"
        style={{
          backgroundColor: themeColors.tabActiveBackground || undefined,
          borderColor: themeColors.borderColor || undefined,
        }}>
        <div className="flex items-center gap-2">
          <LanguageSelect
            value={language}
            options={SHIKI_CODE_LANGUAGES}
            onValueChange={(value: string) => updateLanguage(value as BundledLanguage)}
            currentLabel={currentLanguage.label}
            style={{
              color: themeColors.tabActiveForeground || undefined,
              borderColor: themeColors.borderColor || undefined,
            }}
          />
          <ThemeSelect
            value={theme}
            options={SHIKI_CODE_THEMES}
            onValueChange={(value: string) => updateTheme(value as BundledTheme)}
            currentLabel={currentTheme.label}
            style={{
              color: themeColors.tabActiveForeground || undefined,
              borderColor: themeColors.borderColor || undefined,
            }}
          />
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover/code-block:opacity-100 transition-opacity">
          {canBeautify && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={beautifyCode}
              disabled={isBeautifying}
              title="Beautify code"
              style={{
                color: themeColors.buttonForeground || undefined,
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
              color: themeColors.buttonForeground || undefined,
            }}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          {!editor.readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={deleteCodeElement}
              title="Delete code block"
              style={{
                color: themeColors.buttonForeground || undefined,
              }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div
        className="relative bg-background overflow-hidden"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.foreground,
          caretColor: themeColors.caret,
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
            caretColor: themeColors.caret,
          }}
          onScroll={handleScroll}>
          {children}
        </div>
      </div>
    </div>
  );
};
