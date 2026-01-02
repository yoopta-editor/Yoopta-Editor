import type { PluginEventHandlerOptions, SlateEditor, YooEditor } from '@yoopta/editor';
import { Elements } from '@yoopta/editor';

import type { DividerElement, DividerTheme } from '../types';

const dividerTypes: DividerTheme[] = ['solid', 'dashed', 'dotted', 'gradient'];

export function onKeyDown(
  editor: YooEditor,
  slate: SlateEditor,
  { hotkeys, currentBlock }: PluginEventHandlerOptions,
) {
  return (event) => {
    if (hotkeys.isCmdShiftD(event)) {
      event.preventDefault();

      const element = Elements.getElement(editor, {
        blockId: currentBlock.id,
        type: 'divider',
      }) as DividerElement;
      const theme =
        dividerTypes[(dividerTypes.indexOf(element.props!.theme) + 1) % dividerTypes.length];
      Elements.updateElement(editor, {
        blockId: currentBlock.id,
        type: 'divider',
        props: {
          theme,
        },
      });
    }
  };
}
