import { Blocks, Elements, UI, useYooptaPluginOptions, YooEditor, YooptaBlockData } from '@yoopta/editor';
import {
  RowSpacingIcon,
  SizeIcon,
  WidthIcon,
  ExternalLinkIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  ImageIcon,
  UpdateIcon,
} from '@radix-ui/react-icons';
import { VideoElementProps, VideoPluginElements, VideoPluginOptions } from '../types';
import CheckmarkIcon from '../icons/checkmark.svg';
import DownloadIcon from '../icons/download.svg';
import { useState } from 'react';
import { Loader } from './Loader';

const ALIGN_ICONS = {
  left: TextAlignLeftIcon,
  center: TextAlignCenterIcon,
  right: TextAlignRightIcon,
};

const { ExtendedBlockActions, BlockOptionsMenuGroup, BlockOptionsMenuItem, BlockOptionsSeparator } = UI;

type Props = {
  editor: YooEditor;
  block: YooptaBlockData;
  props?: VideoElementProps;
  settings?: VideoElementProps['settings'];
};

type Loaders = 'poster' | 'video';
const DEFAULT_LOADER_STATE: Record<Loaders, boolean> = { poster: false, video: false };

const VideoBlockOptions = ({ editor, block, props: videoProps }: Props) => {
  const options = useYooptaPluginOptions<VideoPluginOptions>('Video');
  const [loaders, setLoaders] = useState<Record<Loaders, boolean>>(DEFAULT_LOADER_STATE);
  const onSetLoading = (type: Loaders, state: boolean) => setLoaders((prev) => ({ ...prev, [type]: state }));

  const onCover = () => {
    Elements.updateElement<VideoPluginElements, VideoElementProps>(editor, block.id, {
      type: 'video',
      props: { fit: 'cover' },
    });
  };

  const onFit = () => {
    Elements.updateElement<VideoPluginElements, VideoElementProps>(editor, block.id, {
      type: 'video',
      props: { fit: 'contain' },
    });
  };

  const onFill = () => {
    Elements.updateElement<VideoPluginElements, VideoElementProps>(editor, block.id, {
      type: 'video',
      props: { fit: 'fill' },
    });
  };

  const isExternalVideo = !!videoProps?.provider?.id;

  const onDownload = () => {
    if (!videoProps || !videoProps.src || isExternalVideo) return;

    const link = document.createElement('a');
    link.href = videoProps.src;
    link.download = videoProps.src;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onOpen = () => {
    if (videoProps?.provider?.url) {
      window.open(videoProps?.provider?.url, '_blank');
    }
  };

  const currentAlign = block?.meta?.align || 'center';
  const AlignIcon = ALIGN_ICONS[currentAlign];

  const onToggleAlign = () => {
    const aligns = ['left', 'center', 'right'];
    if (!block) return;

    const nextAlign = aligns[(aligns.indexOf(currentAlign) + 1) % aligns.length] as YooptaBlockData['meta']['align'];
    Blocks.updateBlock(editor, block.id, { meta: { ...block.meta, align: nextAlign } });
  };

  const onUploadPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!options?.onUploadPoster) {
      throw new Error('onUploadPoster not provided in plugin options. Check Video.extend({}) method');
    }

    const file = e.target.files?.[0];
    if (!file) return;

    onSetLoading('poster', true);

    const posterSrc = await options.onUploadPoster?.(file);
    Elements.updateElement<VideoPluginElements, VideoElementProps>(editor, block.id, {
      type: 'video',
      props: { poster: posterSrc },
    });

    onSetLoading('poster', false);
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!options?.onUpload) {
      throw new Error('onUpload not provided in plugin options. Check Video.extend({}) method');
    }

    const file = e.target.files?.[0];
    if (!file) return;

    onSetLoading('video', true);

    // [TODO] - abort controller?
    const data = await options?.onUpload(file);
    const defaultVideoProps = editor.plugins.Video.elements.video.props as VideoElementProps;

    Elements.updateElement<VideoPluginElements, VideoElementProps>(editor, block.id, {
      type: 'video',
      props: {
        src: data.src,
        sizes: data.sizes || defaultVideoProps.sizes,
        bgColor: data.bgColor || defaultVideoProps.bgColor,
        fit: videoProps?.fit || data.fit || defaultVideoProps.fit || 'cover',
        settings: videoProps?.settings || data.settings || defaultVideoProps.settings,
      },
    });

    onSetLoading('video', false);
  };

  return (
    <ExtendedBlockActions onClick={() => editor.setPath({ current: block.meta.order })} id="yoopta-video-options">
      <BlockOptionsSeparator />
      {!isExternalVideo && (
        <>
          <BlockOptionsMenuGroup>
            <BlockOptionsMenuItem>
              <button type="button" className="yoopta-block-options-button yoo-video-justify-between" onClick={onFit}>
                <span className="yoo-video-flex">
                  <RowSpacingIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4 yoo-video-mr-2" />
                  {editor.getLabelText('plugins.Video.options.fit.contain') || 'Fit'}
                </span>
                {videoProps?.fit === 'contain' && (
                  <CheckmarkIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4" />
                )}
              </button>
            </BlockOptionsMenuItem>
            <BlockOptionsMenuItem>
              <button type="button" className="yoopta-block-options-button yoo-video-justify-between" onClick={onFill}>
                <span className="yoo-video-flex">
                  <WidthIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4 yoo-video-mr-2" />
                  {editor.getLabelText('plugins.Video.options.fit.fill') || 'Fill'}
                </span>
                {videoProps?.fit === 'fill' && (
                  <CheckmarkIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4" />
                )}
              </button>
            </BlockOptionsMenuItem>
            <BlockOptionsMenuItem>
              <button type="button" className="yoopta-block-options-button yoo-video-justify-between" onClick={onCover}>
                <span className="yoo-video-flex">
                  <SizeIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4 yoo-video-mr-2" />
                  {editor.getLabelText('plugins.Video.options.fit.cover') || 'Cover'}
                </span>
                {videoProps?.fit === 'cover' && (
                  <CheckmarkIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4" />
                )}
              </button>
            </BlockOptionsMenuItem>
          </BlockOptionsMenuGroup>
          <BlockOptionsSeparator />
        </>
      )}
      {!isExternalVideo && (
        <>
          <BlockOptionsMenuGroup>
            <BlockOptionsMenuItem>
              <label
                htmlFor="video-uploader"
                className="yoo-video-rounded-sm yoo-video-relative hover:yoo-video-bg-[#37352f14] yoo-video-leading-[120%] yoo-video-px-2 yoo-video-py-1.5 yoo-video-mx-[4px] yoo-video-cursor-pointer yoo-video-w-full yoo-video-flex yoo-video-justify-start data-[disabled=true]:yoo-video-cursor-not-allowed data-[disabled=true]:yoo-video-pointer-events-none data-[disabled=true]:yoo-video-opacity-50"
                data-disabled={loaders.video}
              >
                <input
                  type="file"
                  accept={options.accept}
                  multiple={false}
                  id="video-uploader"
                  className="yoo-video-absolute yoo-video-hidden"
                  onChange={onUpload}
                  disabled={loaders.video}
                />
                {loaders.video ? (
                  <Loader className="yoo-video-mr-2 yoo-video-user-select-none" width={24} height={24} />
                ) : (
                  <UpdateIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4 yoo-video-mr-2" />
                )}
                {editor.getLabelText('plugins.Video.options.replaceImage') || 'Replace video'}
              </label>
            </BlockOptionsMenuItem>
          </BlockOptionsMenuGroup>
          <BlockOptionsSeparator />
        </>
      )}
      <BlockOptionsMenuGroup>
        {options.onUploadPoster && !isExternalVideo && (
          <BlockOptionsMenuItem>
            <label
              htmlFor="video-poster-uploader"
              className="yoo-video-rounded-sm yoo-video-relative hover:yoo-video-bg-[#37352f14] yoo-video-leading-[120%] yoo-video-px-2 yoo-video-py-1.5 yoo-video-mx-[4px] yoo-video-cursor-pointer yoo-video-w-full yoo-video-flex yoo-video-justify-start data-[disabled=true]:yoo-video-cursor-not-allowed data-[disabled=true]:yoo-video-pointer-events-none data-[disabled=true]:yoo-video-opacity-50"
              data-disabled={loaders.poster}
            >
              <input
                type="file"
                accept="image/*"
                multiple={false}
                id="video-poster-uploader"
                className="yoo-video-absolute yoo-video-hidden"
                onChange={onUploadPoster}
                disabled={loaders.poster}
              />
              {loaders.poster ? (
                <Loader className="yoo-video-mr-2 yoo-video-user-select-none" width={24} height={24} />
              ) : (
                <ImageIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4 yoo-video-mr-2" />
              )}
              {/* {videoProps?.poster ? 'Replace poster' : 'Add poster'} */}
              {videoProps?.poster
                ? editor.getLabelText('plugins.Video.options.replacePosterVideo') || 'Replace poster'
                : editor.getLabelText('plugins.Video.options.addPosterVideo') || 'Add poster'}
            </label>
          </BlockOptionsMenuItem>
        )}
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-button yoo-video-rounded-sm hover:yoo-video-bg-[#37352f14] yoo-video-leading-[120%] yoo-video-px-2 yoo-video-py-1.5 yoo-video-mx-[4px] yoo-video-cursor-pointer yoo-video-w-full yoo-video-flex yoo-video-justify-start"
            onClick={onToggleAlign}
          >
            <AlignIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4 yoo-video-mr-2" />
            {editor.getLabelText('plugins.Video.options.align') || 'Align'}
          </button>
        </BlockOptionsMenuItem>
        <BlockOptionsMenuItem>
          <button
            type="button"
            className="yoopta-button yoo-video-rounded-sm hover:yoo-video-bg-[#37352f14] yoo-video-leading-[120%] yoo-video-px-2 yoo-video-py-1.5 yoo-video-mx-[4px] yoo-video-cursor-pointer yoo-video-w-full yoo-video-flex yoo-video-justify-start"
            onClick={isExternalVideo ? onOpen : onDownload}
          >
            {isExternalVideo ? (
              <>
                <ExternalLinkIcon width={16} height={16} className="yoo-embed-w-4 yoo-embed-h-4 yoo-embed-mr-2" />
                {editor.getLabelText('plugins.Video.options.openVideo') || 'Open'}
              </>
            ) : (
              <>
                <DownloadIcon width={16} height={16} className="yoo-video-w-4 yoo-video-h-4 yoo-video-mr-2" />
                {editor.getLabelText('plugins.Video.options.downloadVideo') || 'Download'}
              </>
            )}
          </button>
        </BlockOptionsMenuItem>
      </BlockOptionsMenuGroup>
    </ExtendedBlockActions>
  );
};

export { VideoBlockOptions };
