import { UI, YooEditor } from '@yoopta/editor';
import { CSSProperties, useState } from 'react';
import { EmbedUploader } from './EmbedUploader';
import { FileUploader } from './FileUploader';

const { Overlay, Portal } = UI;

type Props = {
  floatingStyles: CSSProperties;
  refs: any;
  blockId: string;
  onClose: () => void;
  onSetLoading: (_s: boolean) => void;
  editor: YooEditor;
};

type Tab = 'upload' | 'embed';

const VideoUploader = ({ floatingStyles, refs, onClose, blockId, onSetLoading, editor }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  const switchTab = (tab: Tab) => setActiveTab(tab);

  const isUploader = activeTab === 'upload';
  const isEmbed = activeTab === 'embed';

  const getTabStyles = (isActive) => ({
    borderBottom: isActive ? '2px solid #2483e2' : '2px solid transparent',
  });

  return (
    <Portal id="yoo-video-uploader-portal">
      <Overlay lockScroll className="yoo-video-z-[100]" onClick={onClose}>
        <div ref={refs.setFloating} style={floatingStyles} onClick={(e) => e.stopPropagation()}>
          <div className="yoo-video-flex yoo-video-flex-col yoo-video-min-w-[540px] yoo-video-max-w-[calc(100vw-24px)] yoo-video-h-full yoo-video-max-h-[420px] yoo-video-bg-[#FFFFFF] yoo-video-shadow-[rgb(15_15_15_/5%)_0px_0px_0px_1px,_rgb(15_15_15_/10%)_0px_3px_6px,_rgb(15_15_15_/20%)_0px_9px_24px]">
            <div className="yoo-video-w-full yoo-video-flex yoo-video-text-[14px] yoo-video-p-[0_8px] yoo-video-shadow-[rgb(55_53_47_/9%)_0px_-1px_0px_inset] yoo-video-relative yoo-video-z-10 yoo-video-h-[40px]">
              <button
                type="button"
                onClick={() => switchTab('upload')}
                style={getTabStyles(isUploader)}
                className={`yoopta-button yoo-video-py-[6px] yoo-video-whitespace-nowrap yoo-video-min-w-0 yoo-video-flex-shrink-0 yoo-video-text-[rgb(55,53,47)] yoo-video-relative yoo-video-cursor-pointer yoo-video-user-select-none yoo-video-bg-inherit yoo-video-transition-[height_20ms_ease-in] yoo-video-inline-flex yoo-video-items-center yoo-video-h-full yoo-video-text-[14px] yoo-video-leading-[1.2] yoo-video-px-[8px]`}
              >
                {editor.getLabelText('plugins.Image.options.placeholder.upload.label') || 'Upload'}
              </button>
              <button
                type="button"
                onClick={() => switchTab('embed')}
                style={getTabStyles(isEmbed)}
                className={
                  'yoopta-button yoo-video-py-[6px] yoo-video-whitespace-nowrap yoo-video-min-w-0 yoo-video-flex-shrink-0 yoo-video-text-[rgb(55,53,47)] yoo-video-relative yoo-video-cursor-pointer yoo-video-user-select-none yoo-video-bg-inherit yoo-video-transition-[height_20ms_ease-in] yoo-video-inline-flex yoo-video-items-center yoo-video-h-full yoo-video-text-[14px] yoo-video-leading-[1.2] yoo-video-px-[8px]'
                }
              >
                {editor.getLabelText('plugins.Image.options.placeholder.external.label') || 'Video link'}
              </button>
            </div>
            <div className="yoo-video-pt-[6px] yoo-video-pb-[6px] yoo-video-mt-[4px] yoo-video-flex yoo-video-justify-center yoo-video-mr-[12px] yoo-video-ml-[12px]">
              {isEmbed && <EmbedUploader onClose={onClose} blockId={blockId} />}
              {isUploader && <FileUploader onClose={onClose} blockId={blockId} onSetLoading={onSetLoading} />}
            </div>
          </div>
        </div>
      </Overlay>
    </Portal>
  );
};

export { VideoUploader };
