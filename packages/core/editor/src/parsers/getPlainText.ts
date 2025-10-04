import { getHTML } from './getHTML';
import type { YooEditor, YooptaContentValue } from '../editor/types';

export function getPlainText(editor: YooEditor, content: YooptaContentValue) {
  const htmlString = getHTML(editor, content);

  const div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.innerText;
}
