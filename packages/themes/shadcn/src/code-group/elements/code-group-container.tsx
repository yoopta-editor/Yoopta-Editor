import { useEffect } from 'react';
import type { PluginElementRenderProps, SlateElement } from '@yoopta/editor';
import { Blocks, useYooptaEditor } from '@yoopta/editor';
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki';
import { Element, Transforms } from 'slate';

import { Tabs } from '../../ui/tabs';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    yShiki: HighlighterGeneric<BundledLanguage, BundledTheme> | null;
  }
}

export const CodeGroupContainer = (props: PluginElementRenderProps) => {
  const { attributes, children, blockId, element } = props;
  const editor = useYooptaEditor();
  const theme = props.element.props?.theme;

  useEffect(() => {
    if (window.yShiki) {
      const themeData = window.yShiki.getTheme(theme);

      const activeBg =
        themeData.colors?.['tab.activeBackground'] ??
        themeData.colors?.['editorTab.activeBackground'] ??
        themeData.bg;
      const inactiveBg =
        themeData.colors?.['tab.inactiveBackground'] ??
        themeData.colors?.['editorTab.inactiveBackground'] ??
        themeData.colors?.['editorGroupHeader.tabsBackground'] ??
        themeData.bg;
      const activeFg =
        themeData.colors?.['tab.activeForeground'] ??
        themeData.colors?.['editorTab.activeForeground'] ??
        themeData.fg;
      const inactiveFg =
        themeData.colors?.['tab.inactiveForeground'] ??
        themeData.colors?.['editorTab.inactiveForeground'] ??
        themeData.colors?.['foreground'] ??
        themeData.fg;
      const activeBorder =
        themeData.colors?.['tab.activeBorder'] ??
        themeData.colors?.['editorTab.activeBorder'] ??
        activeBg;
      const borderColor =
        themeData.colors?.['tab.border'] ??
        themeData.colors?.['editorGroupHeader.border'] ??
        themeData.colors?.['editorGroup.border'] ??
        'transparent';
      const editorBg = themeData.colors?.['editor.background'] ?? themeData.bg;
      const editorFg = themeData.colors?.['editor.foreground'] ?? themeData.fg;
      const cursorColor = themeData.colors?.['editorCursor.foreground'] ?? themeData.fg;

      const cssVariables = {
        'code-group-tab-active-bg': activeBg,
        'code-group-tab-inactive-bg': inactiveBg,
        'code-group-tab-active-fg': activeFg,
        'code-group-tab-inactive-fg': inactiveFg,
        'code-group-tab-active-border': activeBorder,
        'code-group-tab-border': borderColor,
        'code-group-editor-bg': editorBg,
        'code-group-editor-fg': editorFg,
        'code-group-editor-cursor': cursorColor,
      };

      Object.entries(cssVariables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
    }
  }, [theme]);

  const onValueChange = (value: string) => {
    const slate = Blocks.getBlockSlate(editor, { id: blockId });
    if (!slate) return;

    Transforms.setNodes<SlateElement>(
      slate,
      { props: { ...element.props, activeTabId: value } },
      {
        at: [0],
        match: (n) => Element.isElement(n) && (n as SlateElement).type === 'code-group-container',
      },
    );
  };

  return (
    <div {...attributes} data-code-group-container className="w-full">
      <Tabs value={element.props?.activeTabId} onValueChange={onValueChange} className="w-full">
        {children}
      </Tabs>
    </div>
  );
};
