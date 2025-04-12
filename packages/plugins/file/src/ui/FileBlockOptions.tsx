import { Blocks, UI, YooEditor, YooptaBlockData } from '@yoopta/editor';
import { ExternalLinkIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from '@radix-ui/react-icons';
import { FileElementProps } from '../types';

const ALIGN_ICONS = {
  left: TextAlignLeftIcon,
  center: TextAlignCenterIcon,
  right: TextAlignRightIcon,
};

const { ExtendedBlockActions, BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptionsSeparator } = UI;

type Props = {
  editor: YooEditor;
  block: YooptaBlockData;
  props?: FileElementProps;
};

const FileBlockOptions = ({ editor, block, props: fileProps }: Props) => {
  const onOpen = () => {
    if (!fileProps?.src) return;
    window.open(fileProps?.src, '_blank');
  };

  const currentAlign = block?.meta?.align || 'center';
  const AlignIcon = ALIGN_ICONS[currentAlign];

  const onToggleAlign = () => {
    const aligns = ['left', 'center', 'right'];
    if (!block) return;

    const nextAlign = aligns[(aligns.indexOf(currentAlign) + 1) % aligns.length] as YooptaBlockData['meta']['align'];
    Blocks.updateBlock(editor, block.id, { meta: { ...block.meta, align: nextAlign } });
  };

  return (
    <ExtendedBlockActions onClick={() => editor.setPath({ current: block.meta.order })}>
      <BlockOptionsSeparator />
      <BlockOptionsMenuGroup>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={onToggleAlign}>
            <AlignIcon width={16} height={16} className="yoo-file-w-4 yoo-file-h-4 yoo-file-mr-2" />
            {editor.getLabelText('plugins.File.options.align') || 'Align'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button type="button" className="yoopta-block-options-button" onClick={onOpen}>
            <ExternalLinkIcon width={16} height={16} className="yoo-file-w-4 yoo-file-h-4 yoo-file-mr-2" />
            {editor.getLabelText('plugins.File.options.openFile') || 'Open'}
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </ExtendedBlockActions>
  );
};

export { FileBlockOptions };
