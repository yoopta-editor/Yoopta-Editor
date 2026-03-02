"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import YooptaEditor, { createYooptaEditor, RenderBlockProps, YooptaContentValue } from '@yoopta/editor';

import { CMS_PLUGINS } from './plugins';
import { CMS_MARKS } from './marks';
import { SelectionBox } from '@yoopta/ui/selection-box';
import { BlockDndContext, SortableBlock } from '@yoopta/ui/block-dnd';
import { CMSToolbar } from './components/cms-toolbar';
import { CMSSlashCommandMenu } from './components/cms-slash-command-menu';
import { CMSFloatingBlockActions } from './components/cms-floating-block-actions';
import { CMSSidebar } from './components/cms-sidebar';
import { CMSCtaBar } from './components/cms-cta-bar';
import { DEFAULT_PAGE_SETTINGS, type CMSPageSettings } from './page-settings';

import './editor.css';

const EDITOR_STYLES = {
  width: '100%',
  paddingBottom: 100,
};

type CMSEditorProps = {
  initialValue?: YooptaContentValue;
  containerBoxRef?: React.RefObject<HTMLDivElement>;
};

const CMS_EDITOR_LS_KEY = 'yoopta-cms-editor-value';
const CMS_PAGE_SETTINGS_LS_KEY = 'yoopta-cms-page-settings';

const CMSEditor = ({ initialValue, containerBoxRef: externalRef }: CMSEditorProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerBoxRef = externalRef ?? internalRef;
  const [pageSettings, setPageSettings] = useState<CMSPageSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_PAGE_SETTINGS;
    try {
      const saved = localStorage.getItem(CMS_PAGE_SETTINGS_LS_KEY);
      return saved ? { ...DEFAULT_PAGE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_PAGE_SETTINGS;
    } catch {
      return DEFAULT_PAGE_SETTINGS;
    }
  });

  const editor = useMemo(() => {
    return createYooptaEditor({ plugins: CMS_PLUGINS, marks: CMS_MARKS });
  }, []);

  const onChange = (value: YooptaContentValue) => {
    localStorage.setItem(CMS_EDITOR_LS_KEY, JSON.stringify(value));
  };

  useEffect(() => {
    const localStorageValue = localStorage.getItem(CMS_EDITOR_LS_KEY);
    const data = localStorageValue ? JSON.parse(localStorageValue) : initialValue;

    if (data) {
      editor.withoutSavingHistory(() => {
        editor.setEditorValue(data);
        editor.focus();
      });
    }
  }, [editor, initialValue]);

  const renderBlock = useCallback(({ children, blockId }: RenderBlockProps) => {
    return (
      <SortableBlock id={blockId} useDragHandle>
        {children}
      </SortableBlock>
    );
  }, []);

  const handlePageSettingsChange = useCallback((settings: CMSPageSettings) => {
    setPageSettings(settings);
    localStorage.setItem(CMS_PAGE_SETTINGS_LS_KEY, JSON.stringify(settings));
  }, []);

  const cssVariables = {
    '--cms-font-family': pageSettings.fontFamily,
    '--cms-bg': pageSettings.background,
    '--cms-primary': pageSettings.primaryColor,
    '--cms-secondary': pageSettings.secondaryColor,
    '--cms-accent': pageSettings.accentColor,
    '--cms-max-width': pageSettings.maxWidth,
  } as React.CSSProperties;


  console.log(' CMS Editor rendered', editor.isEmpty());

  return (
    <div className="yoo-cms-layout">
      <div
        ref={containerBoxRef}
        className="yoo-cms-editor-area"
        style={{ ...cssVariables, background: pageSettings.background, fontFamily: pageSettings.fontFamily }}
      >
        <div style={{ width: '100%', maxWidth: pageSettings.maxWidth, margin: '0 auto' }}>
          <BlockDndContext editor={editor}>
            <YooptaEditor
              editor={editor}
              style={EDITOR_STYLES}
              onChange={onChange}
              renderBlock={renderBlock}
              placeholder="Type / to open menu, or start building your website..."
            >
              <CMSToolbar />
              <CMSFloatingBlockActions />
              <CMSSlashCommandMenu />
              <SelectionBox selectionBoxElement={containerBoxRef} />
            </YooptaEditor>
          </BlockDndContext>
        </div>
      </div>
      <CMSSidebar
        editor={editor}
        pageSettings={pageSettings}
        onPageSettingsChange={handlePageSettingsChange}
      />
      <CMSCtaBar />
    </div>
  );
};

export { CMSEditor };
