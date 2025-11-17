import { Elements, UI, YooEditor, YooptaBlockData } from '@yoopta/editor';
import { Lollipop, FlipVertical, FlipHorizontal } from 'lucide-react';
import { CarouselElementProps } from '../types';

const { ExtendedBlockOptions, BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptionsSeparator } =
  UI;

type Props = {
  editor: YooEditor;
  block: YooptaBlockData;
  props: CarouselElementProps;
};

const CarouselBlockOptions = ({ editor, block, props }: Props) => {
  const orientation = props.orientation;
  const loop = props.loop;

  const isHorizontal = orientation === 'horizontal';
  const isLoop = loop;

  const switchLoop = () => {
    Elements.updateElement(editor, block.id, { type: 'carousel', props: { loop: !isLoop } });
  };
  const switchOrientation = () => {
    Elements.updateElement(editor, block.id, {
      type: 'carousel',
      props: { orientation: isHorizontal ? 'vertical' : 'horizontal' },
    });
  };

  return (
    <ExtendedBlockOptions
      onClick={() => editor.setPath({ current: block.meta.order })}
      className="yoopta-carousel-options">
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button justify-between"
            onClick={switchLoop}>
            <span className="flex">
              <Lollipop width={16} height={16} className="w-4 h-4 mr-2" />
              {loop ? 'Disable loop' : 'Make it loop'}
            </span>
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-block-options-button justify-between"
            onClick={switchOrientation}>
            <span className="flex">
              {isHorizontal ? (
                <FlipHorizontal width={16} height={16} className="w-4 h-4 mr-2" />
              ) : (
                <FlipVertical width={16} height={16} className="w-4 h-4 mr-2" />
              )}
              {isHorizontal ? 'Make it vertical' : 'Make it horizontal'}
            </span>
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </ExtendedBlockOptions>
  );
};

export { CarouselBlockOptions };
