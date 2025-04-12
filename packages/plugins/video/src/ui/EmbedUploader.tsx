import { Elements, useYooptaEditor } from '@yoopta/editor';
import { ChangeEvent, useState } from 'react';
import { VideoElementProps, VideoPluginElements } from '../types';
import { getProvider, ProviderGetters } from '../utils/providers';

const EmbedUploader = ({ blockId, onClose }) => {
  const editor = useYooptaEditor();
  const [value, setValue] = useState('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const embed = () => {
    if (value.length === 0) return;

    const providerType = getProvider(value);
    const videoId = providerType ? ProviderGetters[providerType]?.(value) : null;

    if (!providerType || !videoId) return console.warn('Unsupported video provider or video id is not found.');

    Elements.updateElement<VideoPluginElements, VideoElementProps>(editor, blockId, {
      type: 'video',
      props: {
        src: value,
        provider: { type: providerType, id: videoId, url: value },
      },
    });

    onClose();
  };

  const isEmpty = value.length === 0;

  return (
    <div className="yoo-video-cursor-pointer yoo-video-user-select-none yoo-video-transition-bg yoo-video-duration-20 yoo-video-ease-in yoo-video-white-space-nowrap yoo-video-w-full">
      <input
        type="text"
        placeholder={
          editor.getLabelText('plugins.Image.options.placeholder.external.placeholder') || 'Paste video link'
        }
        value={value}
        className="yoo-video-items-center yoo-video-bg-[hsla(45,13%,94%,.6)] yoo-video-rounded-[4px] yoo-video-shadow-[inset_0_0_0_1px_hsla(0,0%,6%,.1)] yoo-video-cursor-text yoo-video-flex yoo-video-text-[14px] yoo-video-h-[32px] yoo-video-leading-[20px] yoo-video-px-[6px] yoo-video-relative yoo-video-w-full yoo-video-border-none"
        onChange={onChange}
      />
      <button
        type="button"
        className="yoopta-button yoo-video-user-select-none yoo-video-transition-bg yoo-video-duration-20 yoo-video-ease-in yoo-video-cursor-pointer yoo-video-flex yoo-video-items-center yoo-video-justify-center yoo-video-flex-shrink-0 yoo-video-white-space-nowrap yoo-video-h-[28px] yoo-video-rounded-[4px] yoo-video-shadow-[rgba(15,15,15,0.1)_0px_0px_0px_1px_inset,_rgba(15,15,15,0.1)_0px_1px_2px] yoo-video-bg-[rgb(35,131,226)] yoo-video-text-white yoo-video-fill-white yoo-video-leading-[1.2] yoo-video-px-[12px] yoo-video-text-[14px] yoo-video-font-medium yoo-video-w-full yoo-video-max-w-[300px] yoo-video-mx-auto yoo-video-m-[12px_0_6px] disabled:yoo-video-bg-[rgba(35,131,226,0.5)] disabled:yoo-video-cursor-not-allowed"
        disabled={isEmpty}
        onClick={embed}
      >
        {editor.getLabelText('plugins.Image.options.placeholder.external.button') || 'Embed video'}
      </button>
    </div>
  );
};

export { EmbedUploader };
