import { CSSProperties } from 'react';
import { UI, YooEditor } from '@yoopta/editor';
import { EmbedLinkUploader } from './EmbedLinkUploader';

type Props = {
  floatingStyles: CSSProperties;
  refs: any;
  blockId: string;
  onClose: () => void;
  editor: YooEditor;
};

const { Overlay, Portal } = UI;

const EmbedUploader = ({ editor, floatingStyles, refs, onClose, blockId }: Props) => {
  const getTabStyles = () => ({
    borderBottom: '2px solid #2483e2',
  });

  return (
    <Portal id="yoo-embed-uploader-portal">
      <Overlay lockScroll className="yoo-embed-z-[100]" onClick={onClose}>
        <div ref={refs.setFloating} style={floatingStyles} onClick={(e) => e.stopPropagation()}>
          <div className="yoo-embed-flex yoo-embed-flex-col yoo-embed-min-w-[540px] yoo-embed-max-w-[calc(100vw-24px)] yoo-embed-h-full yoo-embed-max-h-[420px] yoo-embed-bg-[#FFFFFF] yoo-embed-shadow-[rgb(15_15_15_/5%)_0px_0px_0px_1px,_rgb(15_15_15_/10%)_0px_3px_6px,_rgb(15_15_15_/20%)_0px_9px_24px]">
            <div className="yoo-embed-w-full yoo-embed-flex yoo-embed-text-[14px] yoo-embed-p-[0_8px] yoo-embed-shadow-[rgb(55_53_47_/9%)_0px_-1px_0px_inset] yoo-embed-relative yoo-embed-z-10 yoo-embed-h-[40px]">
              <button
                type="button"
                style={getTabStyles()}
                className={
                  'yoopta-button yoo-embed-py-[6px] yoo-embed-whitespace-nowrap yoo-embed-min-w-0 yoo-embed-flex-shrink-0 yoo-embed-text-[rgb(55,53,47)] yoo-embed-relative yoo-embed-cursor-pointer yoo-embed-user-select-none yoo-embed-bg-inherit yoo-embed-transition-[height_20ms_ease-in] yoo-embed-inline-flex yoo-embed-items-center yoo-embed-h-full yoo-embed-text-[14px] yoo-embed-leading-[1.2] yoo-embed-px-[8px]'
                }
              >
                {editor.getLabelText('plugins.Embed.options.placeholder.external.label') || 'Embed link'}
              </button>
            </div>
            <div className="yoo-embed-pt-[6px] yoo-embed-pb-[6px] yoo-embed-mt-[4px] yoo-embed-flex yoo-embed-justify-center yoo-embed-mr-[12px] yoo-embed-ml-[12px]">
              <EmbedLinkUploader onClose={onClose} blockId={blockId} />
            </div>
          </div>
        </div>
      </Overlay>
    </Portal>
  );
};

export { EmbedUploader };
