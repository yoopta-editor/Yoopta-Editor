import type { YooEditor, YooptaBlockData } from '@yoopta/editor';
import { Elements, UI } from '@yoopta/editor';

import CheckmarkIcon from '../icons/checkmark.svg';
import DashedIcon from '../icons/dashed.svg';
import DotsIcon from '../icons/dots.svg';
import SolidIcon from '../icons/solid.svg';
import type { DividerElementProps, DividerTheme } from '../types';

const { ExtendedBlockOptions, BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptionsSeparator } =
  UI;

type Props = {
  editor: YooEditor;
  block: YooptaBlockData;
  props?: DividerElementProps;
};

const DividerBlockOptions = ({ editor, block, props: dividerProps }: Props) => {
  const onChangeTheme = (theme: DividerTheme) => {
    Elements.updateElement<'divider', DividerElementProps>(editor, block.id, {
      type: 'divider',
      props: {
        theme,
      },
    });
  };

  const isActiveTheme = (theme: DividerTheme) => dividerProps?.theme === theme;

  return (
    <ExtendedBlockOptions
      onClick={() => editor.setPath({ current: block.meta.order })}
      className="yoopta-divider-options">
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-divider-justify-between"
            onClick={() => onChangeTheme('solid')}>
            <span className="yoo-divider-flex">
              <SolidIcon
                width={16}
                height={16}
                className="yoo-divider-w-4 yoo-divider-h-4 yoo-divider-mr-2"
              />
              Line
            </span>
            {isActiveTheme('solid') && (
              <CheckmarkIcon
                width={16}
                height={16}
                color="#000"
                className="yoo-divider-w-4 yoo-divider-h-4"
              />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-divider-justify-between"
            onClick={() => onChangeTheme('dashed')}>
            <span className="yoo-divider-flex">
              <DashedIcon
                width={16}
                height={16}
                color="tranparent"
                className="yoo-divider-w-4 yoo-divider-h-4 yoo-divider-mr-2"
              />
              Dashed
            </span>
            {isActiveTheme('dashed') && (
              <CheckmarkIcon
                width={16}
                height={16}
                color="#000"
                className="yoo-divider-w-4 yoo-divider-h-4"
              />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-divider-justify-between"
            onClick={() => onChangeTheme('dotted')}>
            <span className="yoo-divider-flex">
              <DotsIcon
                width={16}
                height={16}
                className="yoo-divider-w-4 yoo-divider-h-4 yoo-divider-mr-2"
              />
              Dots
            </span>
            {isActiveTheme('dotted') && (
              <CheckmarkIcon
                width={16}
                height={16}
                color="#000"
                className="yoo-divider-w-4 yoo-divider-h-4"
              />
            )}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button yoo-divider-justify-between"
            onClick={() => onChangeTheme('gradient')}>
            <span className="yoo-divider-flex">
              <SolidIcon
                width={14}
                height={16}
                className="yoo-divider-w-4 yoo-divider-h-4 yoo-divider-mr-2"
                color={dividerProps?.color || '#EFEFEE'}
              />
              Gradient
            </span>
            {isActiveTheme('gradient') && (
              <CheckmarkIcon
                width={16}
                height={16}
                color="#000"
                className="yoo-divider-w-4 yoo-divider-h-4"
              />
            )}
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </ExtendedBlockOptions>
  );
};

export { DividerBlockOptions };
