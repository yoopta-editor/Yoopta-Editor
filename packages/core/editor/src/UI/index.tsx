import * as BlockOptionsUI from './BlockOptions/BlockOptions';
import { ExtendedBlockOptions } from './ExtendedBlockOptions/ExtendedBlockOptions';
import { Overlay } from './Overlay/Overlay';
import { Portal } from './Portal/Portal';

export { type BlockOptionsProps } from './BlockOptions/BlockOptions';

export const UI = {
  ...BlockOptionsUI,
  ExtendedBlockOptions,
  Portal,
  Overlay,
};
