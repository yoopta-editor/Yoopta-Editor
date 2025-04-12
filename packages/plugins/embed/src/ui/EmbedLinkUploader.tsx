import { Elements, useYooptaEditor } from '@yoopta/editor';
import { ChangeEvent, useState } from 'react';
import { EmbedElementProps, EmbedPluginElements, EmbedProvider } from '../types';
import { getProvider, ProviderGetters } from '../utils/providers';

const EmbedLinkUploader = ({ blockId, onClose }) => {
  const editor = useYooptaEditor();
  const [value, setValue] = useState('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const embed = () => {
    if (value.length === 0) return;

    const providerType = getProvider(value);
    const embedId = providerType ? ProviderGetters[providerType]?.(value) : null;
    const provider: EmbedProvider = { type: providerType, id: embedId, url: value };

    if (!providerType || !embedId) {
      provider.id = value;
    }

    Elements.updateElement<EmbedPluginElements, EmbedElementProps>(editor, blockId, {
      type: 'embed',
      props: {
        provider,
      },
    });

    onClose();
  };

  const isEmpty = value.length === 0;

  return (
    <div className="yoo-embed-cursor-pointer yoo-embed-user-select-none yoo-embed-transition-bg yoo-embed-duration-20 yoo-embed-ease-in yoo-embed-white-space-nowrap yoo-embed-w-full">
      <input
        type="text"
        placeholder={
          editor.getLabelText('plugins.Embed.options.placeholder.external.placeholder') || 'Paste embed link'
        }
        value={value}
        className="yoo-embed-items-center yoo-embed-bg-[hsla(45,13%,94%,.6)] yoo-embed-rounded-[4px] yoo-embed-shadow-[inset_0_0_0_1px_hsla(0,0%,6%,.1)] yoo-embed-cursor-text yoo-embed-flex yoo-embed-text-[14px] yoo-embed-h-[32px] yoo-embed-leading-[20px] yoo-embed-px-[6px] yoo-embed-relative yoo-embed-w-full yoo-embed-border-none"
        onChange={onChange}
      />
      <button
        type="button"
        className="yoopta-button yoo-embed-user-select-none yoo-embed-transition-bg yoo-embed-duration-20 yoo-embed-ease-in yoo-embed-cursor-pointer yoo-embed-flex yoo-embed-items-center yoo-embed-justify-center yoo-embed-flex-shrink-0 yoo-embed-white-space-nowrap yoo-embed-h-[28px] yoo-embed-rounded-[4px] yoo-embed-shadow-[rgba(15,15,15,0.1)_0px_0px_0px_1px_inset,_rgba(15,15,15,0.1)_0px_1px_2px] yoo-embed-bg-[rgb(35,131,226)] yoo-embed-text-white yoo-embed-fill-white yoo-embed-leading-[1.2] yoo-embed-px-[12px] yoo-embed-text-[14px] yoo-embed-font-medium yoo-embed-w-full yoo-embed-max-w-[300px] yoo-embed-mx-auto yoo-embed-m-[12px_0_6px] disabled:yoo-embed-bg-[rgba(35,131,226,0.5)] disabled:yoo-embed-cursor-not-allowed"
        disabled={isEmpty}
        onClick={embed}
      >
        {editor.getLabelText('plugins.Embed.options.placeholder.external.button') || 'Embed link'}
      </button>
    </div>
  );
};

export { EmbedLinkUploader };
