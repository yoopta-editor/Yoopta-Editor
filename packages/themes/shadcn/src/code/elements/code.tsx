import { useCallback, useEffect, useRef, useState } from 'react';
import { HighlightedCodeOverlay } from '@yoopta/code';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import copy from 'copy-to-clipboard';
import { Check, Copy, Trash2 } from 'lucide-react';
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { Editor, Element, Text } from 'slate';

import { LanguageSelect } from './language-select';
import { ThemeSelect } from './theme-select';
import { Button } from '../../ui/button';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    yShiki?: HighlighterGeneric<BundledLanguage, BundledTheme> | null;
  }
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
] as const;

const THEMES = [
  { value: 'andromeeda', label: 'Andromeeda' },
  { value: 'aurora-x', label: 'Aurora X' },
  { value: 'ayu-dark', label: 'Ayu Dark' },
  { value: 'catppuccin-frappe', label: 'Catppuccin Frappé' },
  { value: 'catppuccin-latte', label: 'Catppuccin Latte' },
  { value: 'catppuccin-macchiato', label: 'Catppuccin Macchiato' },
  { value: 'catppuccin-mocha', label: 'Catppuccin Mocha' },
  { value: 'dark-plus', label: 'Dark Plus' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'github-light', label: 'GitHub Light' },
] as const;

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
  buttonForeground: string;
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
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    background: '',
    foreground: '',
    caret: '',
    tabActiveBackground: '',
    tabInactiveBackground: '',
    buttonForeground: '',
  });

  useEffect(() => {
    if (window.yShiki) {
      const themeData = window.yShiki.getTheme(theme);

      setThemeColors({
        background: themeData.bg,
        foreground: themeData.fg,
        caret: themeData.colors?.['editorCursor.foreground'] ?? themeData.fg,
        tabActiveBackground:
          themeData.colors?.['editorTab.activeBackground'] ??
          themeData.colors?.['tab.activeBackground'] ??
          themeData.bg,
        tabInactiveBackground:
          themeData.colors?.['editorTab.inactiveBackground'] ??
          themeData.colors?.['tab.inactiveBackground'] ??
          themeData.bg,
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

  const copyCode = useCallback(() => {
    const codeText = getNodeText(element);
    const success = copy(codeText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [element]);

  const deleteCodeElement = useCallback(() => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    const elementPath = Elements.getElementPath(editor, blockId, element);
    if (!elementPath) return;

    const parentEntry = elementPath ? Editor.parent(slate, elementPath) : undefined;
    if (parentEntry && Element.isElement(parentEntry[0]) && !Editor.isEditor(parentEntry[0])) {
      Elements.deleteElement(editor, blockId, {
        type: 'code',
        path: elementPath,
      });
      return;
    }

    Blocks.deleteBlock(editor, { blockId, focus: true });
  }, [editor, blockId, element]);

  const updateLanguage = useCallback(
    (newLanguage: string) => {
      Elements.updateElement(editor, blockId, {
        type: 'code',
        props: {
          ...element.props,
          language: newLanguage,
        },
      });
    },
    [editor, blockId, element.props],
  );

  const updateTheme = useCallback(
    (newTheme: string) => {
      Elements.updateElement(editor, blockId, {
        type: 'code',
        props: {
          ...element.props,
          theme: newTheme,
        },
      });
    },
    [editor, blockId, element.props],
  );

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const text = e.clipboardData.getData('text/plain');

    const elements = editor.y('code', {
      props: {
        language: language ?? 'javascript',
        theme: theme ?? 'github-dark',
      },
      children: [editor.y.text(text)],
    });

    editor.toggleBlock('Code', {
      elements,
      at: editor.path.current,
      focus: true,
    });
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.value === language) ?? LANGUAGES[0];
  const currentTheme = THEMES.find((t) => t.value === theme) ?? THEMES[0];

  return (
    <div
      {...attributes}
      className="relative my-4 group/code-block rounded-lg border border-border bg-muted/50 overflow-hidden"
      onPaste={onPaste}>
      <div
        contentEditable={false}
        className="flex items-center justify-between px-4 py-2 border-b border-border select-none"
        style={{
          backgroundColor: themeColors.tabActiveBackground || undefined,
        }}>
        <div className="flex items-center gap-2">
          <LanguageSelect
            value={language}
            options={LANGUAGES}
            onValueChange={updateLanguage}
            currentLabel={currentLanguage.label}
          />
          <ThemeSelect
            value={theme}
            options={THEMES}
            onValueChange={updateTheme}
            currentLabel={currentTheme.label}
          />
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover/code-block:opacity-100 transition-opacity">
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
          className="absolute inset-0 p-4 font-mono text-sm whitespace-pre overflow-auto pointer-events-none z-10"
          style={{
            lineHeight: '1.6',
            tabSize: 2,
          }}
          aria-hidden="true">
          <HighlightedCodeOverlay element={element} language={language} theme={theme} />
        </div>

        <div
          className="relative p-4 font-mono text-sm whitespace-pre overflow-auto min-h-[100px]"
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
