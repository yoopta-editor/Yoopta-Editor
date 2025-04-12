import { UI, YooEditor } from '@yoopta/editor';
import { CSSProperties } from 'react';
import { FileUploader } from './FileUploader';

type Props = {
  floatingStyles: CSSProperties;
  refs: any;
  blockId: string;
  onClose: () => void;
  onSetLoading: (_s: boolean) => void;
  editor: YooEditor;
};

const { Overlay, Portal } = UI;

const FilePlaceholderUploader = ({ editor, floatingStyles, refs, onClose, blockId, onSetLoading }: Props) => {
  const getTabStyles = () => ({
    borderBottom: '2px solid #2483e2',
  });

  return (
    <Portal id="yoo-file-uploader-portal">
      <Overlay lockScroll className="yoo-file-z-[100]" onClick={onClose}>
        <div ref={refs.setFloating} style={floatingStyles} onClick={(e) => e.stopPropagation()}>
          <div className="yoo-file-flex yoo-file-flex-col yoo-file-min-w-[540px] yoo-file-max-w-[calc(100vw-24px)] yoo-file-h-full yoo-file-max-h-[420px] yoo-file-bg-[#FFFFFF] yoo-file-shadow-[rgb(15_15_15_/5%)_0px_0px_0px_1px,_rgb(15_15_15_/10%)_0px_3px_6px,_rgb(15_15_15_/20%)_0px_9px_24px]">
            <div className="yoo-file-w-full yoo-file-flex yoo-file-text-[14px] yoo-file-p-[0_8px] yoo-file-shadow-[rgb(55_53_47_/9%)_0px_-1px_0px_inset] yoo-file-relative yoo-file-z-10 yoo-file-h-[40px]">
              <button
                type="button"
                style={getTabStyles()}
                className={`yoopta-button yoo-file-py-[6px] yoo-file-whitespace-nowrap yoo-file-min-w-0 yoo-file-flex-shrink-0 yoo-file-text-[rgb(55,53,47)] yoo-file-relative yoo-file-cursor-pointer yoo-file-user-select-none yoo-file-bg-inherit yoo-file-transition-[height_20ms_ease-in] yoo-file-inline-flex yoo-file-items-center yoo-file-h-full yoo-file-text-[14px] yoo-file-leading-[1.2] yoo-file-px-[8px]`}
              >
                {editor.getLabelText('plugins.File.options.placeholder.upload.label') || 'Upload'}
              </button>
            </div>
            <div className="yoo-file-pt-[6px] yoo-file-pb-[6px] yoo-file-mt-[4px] yoo-file-flex yoo-file-justify-center yoo-file-mr-[12px] yoo-file-ml-[12px]">
              <FileUploader onClose={onClose} blockId={blockId} onSetLoading={onSetLoading} />
            </div>
          </div>
        </div>
      </Overlay>
    </Portal>
  );
};

export { FilePlaceholderUploader };
