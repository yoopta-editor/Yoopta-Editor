import { useFloating, inline, flip, shift, offset } from '@floating-ui/react';
import { VideoIcon } from '@radix-ui/react-icons';
import { CSSProperties, useState } from 'react';
import { VideoUploader } from './VideoUploader';
import { Loader } from './Loader';
import { useYooptaEditor } from '@yoopta/editor';

const loadingStyles: CSSProperties = {
  width: '100%',
  transition: 'width 100ms ease-in',
};

const Placeholder = ({ attributes, children, blockId }) => {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const editor = useYooptaEditor();

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom',
    open: isUploaderOpen,
    onOpenChange: setIsUploaderOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
  });

  const onSetLoading = (state: boolean) => setLoading(state);

  return (
    <div
      className="yoo-video-w-full yoo-video-user-select-none yoo-video-m-[20px_0_10px] yoo-video-relative yoo-video-flex"
      {...attributes}
      contentEditable={false}
    >
      <button
        type="button"
        className={`yoopta-button yoo-video-p-[12px_36px_12px_12px] yoo-video-flex yoo-video-items-center yoo-video-text-left yoo-video-w-full yoo-video-overflow-hidden yoo-video-rounded-[3px] yoo-video-text-[14px] yoo-video-text-[rgba(55,53,47,0.65)] yoo-video-relative yoo-video-cursor-pointer yoo-video-border-none yoo-video-bg-[#efefef] yoo-video-transition-[background-color_100ms_ease-in] hover:yoo-video-bg-[#e3e3e3]`}
        onClick={() => setIsUploaderOpen(true)}
        disabled={loading}
        ref={refs.setReference}
      >
        {loading ? (
          <Loader className="yoo-video-mr-2 yoo-video-user-select-none" width={24} height={24} />
        ) : (
          <VideoIcon className="yoo-video-mr-2 yoo-video-user-select-none" width={24} height={24} />
        )}
        <span className="yoo-video-font-medium">
          {loading
            ? editor.getLabelText('plugins.Image.options.placeholder.loading') || 'Loading...'
            : editor.getLabelText('plugins.Image.options.placeholder.title') || 'Click to add video'}
        </span>
        {loading && (
          <div
            className="yoo-video-absolute yoo-video-top-0 yoo-video-left-0 yoo-video-h-full yoo-video-bg-[rgba(55,53,47,0.16)]"
            style={loadingStyles}
          />
        )}
      </button>
      {isUploaderOpen && (
        <VideoUploader
          blockId={blockId}
          floatingStyles={floatingStyles}
          refs={refs}
          onClose={() => setIsUploaderOpen(false)}
          onSetLoading={onSetLoading}
          editor={editor}
        />
      )}
      {children}
    </div>
  );
};

export { Placeholder };
