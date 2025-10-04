import type { GetBlockElementEntryOptions } from './getElementEntry';
import { getElementEntry } from './getElementEntry';
import type { SlateElement, YooEditor } from '../types';

export type GetBlockElementOptions = GetBlockElementEntryOptions;

export function getElement<TElementKeys extends string>(
  editor: YooEditor,
  blockId: string,
  options?: GetBlockElementOptions,
): SlateElement<TElementKeys> | undefined {
  const elementEntry = getElementEntry(editor, blockId, options);

  if (elementEntry) {
    return elementEntry[0] as SlateElement<TElementKeys>;
  }

  return undefined;
}
