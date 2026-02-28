'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import YooptaEditor, { createYooptaEditor, YooptaContentValue } from '@yoopta/editor';
import { CMS_PLUGINS } from '../editor/plugins';
import { CMS_MARKS } from '../editor/marks';
import { DEFAULT_PAGE_SETTINGS, type CMSPageSettings } from '../editor/page-settings';

const CMS_EDITOR_LS_KEY = 'yoopta-cms-editor-value';
const CMS_PAGE_SETTINGS_LS_KEY = 'yoopta-cms-page-settings';

const PREVIEW_STYLES = {
  width: '100%',
};

export default function CMSPreviewPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<YooptaContentValue | null>(null);
  const [pageSettings, setPageSettings] = useState<CMSPageSettings>(DEFAULT_PAGE_SETTINGS);
  const [isEmpty, setIsEmpty] = useState(false);

  const editor = useMemo(() => {
    return createYooptaEditor({ plugins: CMS_PLUGINS, marks: CMS_MARKS, readOnly: true });
  }, []);

  useEffect(() => {
    const savedValue = localStorage.getItem(CMS_EDITOR_LS_KEY);
    const savedSettings = localStorage.getItem(CMS_PAGE_SETTINGS_LS_KEY);

    if (savedSettings) {
      try {
        setPageSettings({ ...DEFAULT_PAGE_SETTINGS, ...JSON.parse(savedSettings) });
      } catch { }
    }

    if (savedValue) {
      try {
        const data = JSON.parse(savedValue);
        setValue(data);
      } catch {
        setIsEmpty(true);
      }
    } else {
      setIsEmpty(true);
    }
  }, []);

  useEffect(() => {
    if (value && editor) {
      editor.withoutSavingHistory(() => {
        editor.setEditorValue(value);
      });
    }
  }, [editor, value]);

  const cssVariables = {
    '--cms-font-family': pageSettings.fontFamily,
    '--cms-bg': pageSettings.background,
    '--cms-primary': pageSettings.primaryColor,
    '--cms-secondary': pageSettings.secondaryColor,
    '--cms-accent': pageSettings.accentColor,
    '--cms-max-width': pageSettings.maxWidth,
  } as React.CSSProperties;

  if (isEmpty) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16, color: '#6b7280' }}>
        <div style={{ fontSize: 48, opacity: 0.3 }}>&#128196;</div>
        <p style={{ fontSize: 18 }}>No content to preview</p>
        <a href="/cms-editor" style={{ fontSize: 14, color: '#3b82f6', textDecoration: 'underline' }}>
          Go to editor
        </a>
      </div>
    );
  }

  if (!value) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#9ca3af' }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        ...cssVariables,
        minHeight: '100vh',
        background: pageSettings.background,
        fontFamily: pageSettings.fontFamily,
      }}
    >
      <div style={{ width: '100%', maxWidth: pageSettings.maxWidth, margin: '0 auto' }}>
        <YooptaEditor
          editor={editor}
          readOnly
          style={PREVIEW_STYLES}
        />
      </div>
    </div>
  );
}
