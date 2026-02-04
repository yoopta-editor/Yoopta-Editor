import { useMemo } from 'react';
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

  // Compute scoped CSS variables from Shiki theme
  const cssVariables = useMemo(() => {
    if (!window.yShiki || !theme) return {};

    const themeData = window.yShiki.getTheme(theme);
    const colors = themeData.colors ?? {};

    const activeBg =
      colors['tab.activeBackground'] ?? colors['editorTab.activeBackground'] ?? themeData.bg;
    const inactiveBg =
      colors['tab.inactiveBackground'] ??
      colors['editorTab.inactiveBackground'] ??
      colors['editorGroupHeader.tabsBackground'] ??
      themeData.bg;
    const activeFg =
      colors['tab.activeForeground'] ?? colors['editorTab.activeForeground'] ?? themeData.fg;
    const inactiveFg =
      colors['tab.inactiveForeground'] ??
      colors['editorTab.inactiveForeground'] ??
      colors['foreground'] ??
      themeData.fg;
    const activeBorder =
      colors['tab.activeBorder'] ?? colors['editorTab.activeBorder'] ?? activeFg;
    const borderColor =
      colors['tab.border'] ??
      colors['editorGroupHeader.border'] ??
      colors['editorGroup.border'] ??
      'transparent';
    const editorBg = colors['editor.background'] ?? themeData.bg;
    const editorFg = colors['editor.foreground'] ?? themeData.fg;
    const cursorColor = colors['editorCursor.foreground'] ?? themeData.fg;
    const buttonFg = colors['button.foreground'] ?? colors['icon.foreground'] ?? themeData.fg;

    return {
      '--code-group-tab-active-bg': activeBg,
      '--code-group-tab-inactive-bg': inactiveBg,
      '--code-group-tab-active-fg': activeFg,
      '--code-group-tab-inactive-fg': inactiveFg,
      '--code-group-tab-active-border': activeBorder,
      '--code-group-tab-border': borderColor,
      '--code-group-editor-bg': editorBg,
      '--code-group-editor-fg': editorFg,
      '--code-group-editor-cursor': cursorColor,
      '--code-group-button-fg': buttonFg,
    } as React.CSSProperties;
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
    <div {...attributes} data-code-group-container className="w-full" style={cssVariables}>
      <Tabs value={element.props?.activeTabId} onValueChange={onValueChange} className="w-full">
        {children}
      </Tabs>
    </div>
  );
};
