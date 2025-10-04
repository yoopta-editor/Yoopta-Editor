import * as BlockOptionsUI from './BlockOptions/BlockOptions';
import { ExtendedBlockActions } from './ExtendedBlockActions/ExtendedBlockActions';
import { Overlay } from './Overlay/Overlay';
import { Portal } from './Portal/Portal';

export { type BlockOptionsProps } from './BlockOptions/BlockOptions';

export const UI = {
  ...BlockOptionsUI,
  ExtendedBlockActions,
  Portal,
  Overlay,
};
