import { SlateElement, YooEditor } from '../types';
import { getElementEntry, GetBlockElementEntryOptions } from './getElementEntry';

export type GetBlockElementOptions = GetBlockElementEntryOptions;

export function getElement<TElementKeys extends string>(
  editor: YooEditor,
  blockId: string,
  elementType?: TElementKeys,
  options?: GetBlockElementOptions,
): SlateElement<TElementKeys> | undefined {
  const elementEntry = getElementEntry(editor, blockId, elementType, options);

  if (elementEntry) {
    return elementEntry[0] as SlateElement<TElementKeys>;
  }

  return undefined;
}
