import { useFloating, inline, flip, shift, offset } from '@floating-ui/react';
import { FileIcon } from '@radix-ui/react-icons';
import { useYooptaEditor } from '@yoopta/editor';
import { CSSProperties, useState } from 'react';
import { FilePlaceholderUploader } from './FilePlaceholderUploader';
import { Loader } from './Loader';

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

  const loadingStyles: CSSProperties = {
    width: '100%',
    transition: 'width 100ms ease-in',
  };

  const onSetLoading = (slate: boolean) => setLoading(slate);

  return (
    <div
      className="yoo-file-w-full yoo-file-user-select-none yoo-file-m-[20px_0_10px] yoo-file-relative yoo-file-flex"
      {...attributes}
      contentEditable={false}
    >
      <button
        type="button"
        className={`yoopta-button yoo-file-p-[12px_36px_12px_12px] yoo-file-flex yoo-file-items-center yoo-file-text-left yoo-file-w-full yoo-file-overflow-hidden yoo-file-rounded-[3px] yoo-file-text-[14px] yoo-file-text-[rgba(55,53,47,0.65)] yoo-file-relative yoo-file-cursor-pointer yoo-file-border-none yoo-file-bg-[#efefef] yoo-file-transition-[background-color_100ms_ease-in] hover:yoo-file-bg-[#e3e3e3]`}
        onClick={() => setIsUploaderOpen(true)}
        ref={refs.setReference}
      >
        {loading ? (
          <Loader className="yoo-file-mr-2 yoo-file-user-select-none" width={24} height={24} />
        ) : (
          <FileIcon className="yoo-file-mr-2 yoo-file-user-select-none" width={24} height={24} />
        )}
        <span className="yoo-file-font-medium">
          {loading
            ? editor.getLabelText('plugins.File.options.placeholder.loading') || 'Loading...'
            : editor.getLabelText('plugins.File.options.placeholder.title') || 'Click to add file'}
        </span>
        {loading && (
          <div
            className="yoopta-button yoo-file-absolute yoo-file-top-0 yoo-file-left-0 yoo-file-h-full yoo-file-bg-[rgba(55,53,47,0.16)]"
            style={loadingStyles}
          />
        )}
      </button>
      {isUploaderOpen && (
        <FilePlaceholderUploader
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
