import { Elements, PluginEventHandlerOptions, SlateEditor, YooEditor } from '@yoopta/editor';
import { DividerElement, DividerTheme } from '../types';

const dividerTypes: DividerTheme[] = ['solid', 'dashed', 'dotted', 'gradient'];

export function onKeyDown(
  editor: YooEditor,
  slate: SlateEditor,
  { hotkeys, currentBlock }: PluginEventHandlerOptions,
) {
  return (event) => {
    if (hotkeys.isCmdShiftD(event)) {
      event.preventDefault();

      const element = Elements.getElement(editor, currentBlock.id, {
        type: 'divider',
      }) as DividerElement;
      const theme =
        dividerTypes[(dividerTypes.indexOf(element.props!.theme) + 1) % dividerTypes.length];
      Elements.updateElement(editor, currentBlock.id, {
        type: 'divider',
        props: {
          theme,
        },
      });
    }
  };
}
