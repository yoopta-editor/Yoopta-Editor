import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ContentCopy, Delete as DeleteIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { HighlightedCodeOverlay } from '@yoopta/code';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Blocks, Elements, useYooptaEditor } from '@yoopta/editor';
import copy from 'copy-to-clipboard';
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { Editor, Element, Text } from 'slate';

import { LanguageSelect } from './language-select';
import { ThemeSelect } from './theme-select';

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
    <Paper
      {...attributes}
      elevation={1}
      sx={{
        my: 2,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        '&:hover .code-actions': {
          opacity: 1,
        },
      }}
      onPaste={onPaste}>
      {/* Header */}
      <Box
        contentEditable={false}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          userSelect: 'none',
          backgroundColor: themeColors.tabActiveBackground || undefined,
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
        </Box>

        <Box
          className="code-actions"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s',
          }}>
          <IconButton
            size="small"
            onClick={copyCode}
            title={copied ? 'Copied!' : 'Copy code'}
            sx={{
              color: themeColors.buttonForeground || undefined,
            }}>
            {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={deleteCodeElement}
            title="Delete code block"
            sx={{
              color: themeColors.buttonForeground || undefined,
            }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Code Content */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: themeColors.background || undefined,
          color: themeColors.foreground || undefined,
        }}>
        <Box
          ref={overlayRef}
          sx={{
            position: 'absolute',
            inset: 0,
            p: 2,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            whiteSpace: 'pre',
            overflow: 'auto',
            pointerEvents: 'none',
            zIndex: 10,
            lineHeight: 1.6,
            tabSize: 2,
          }}
          aria-hidden="true">
          <HighlightedCodeOverlay element={element} language={language} theme={theme} />
        </Box>

        <Box
          sx={{
            position: 'relative',
            p: 2,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            whiteSpace: 'pre',
            overflow: 'auto',
            minHeight: '100px',
            lineHeight: 1.6,
            tabSize: 2,
            color: 'transparent',
            caretColor: themeColors.caret || undefined,
          }}
          onScroll={handleScroll}>
          {children}
        </Box>
      </Box>
    </Paper>
  );
};
