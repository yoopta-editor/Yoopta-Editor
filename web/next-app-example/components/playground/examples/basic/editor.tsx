import { useMemo } from 'react';
import YooptaEditor, { createYooptaEditor } from '@yoopta/editor'
import Paragraph from '@yoopta/paragraph';

const EDITOR_STYLES = {
  paddingBottom: 100,
}

const BasicEditor = () => {
  const editor = useMemo(() => createYooptaEditor({ plugins: [Paragraph] }), []);

  return (
    <YooptaEditor editor={editor} style={EDITOR_STYLES} autoFocus />
  )
}

export { BasicEditor }