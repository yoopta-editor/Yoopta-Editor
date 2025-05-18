import { TextOperation } from 'slate';
import { OpMapper } from '../types';
import { insertText } from './insertText';
import { removeText } from './removeText';

export const TEXT_MAPPER: OpMapper<TextOperation> = {
  insert_text: insertText,
  remove_text: removeText,
};
