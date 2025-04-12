import { useFloating, inline, flip, shift, offset } from '@floating-ui/react';
import { CodeIcon } from '@radix-ui/react-icons';
import { useYooptaEditor } from '@yoopta/editor';
import { useState } from 'react';
import { EmbedUploader } from './EmbedUploader';

const Placeholder = ({ attributes, children, blockId }) => {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const editor = useYooptaEditor();

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom',
    open: isUploaderOpen,
    onOpenChange: setIsUploaderOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
  });

  return (
    <div
      className="yoo-embed-w-full yoo-embed-user-select-none yoo-embed-m-[20px_0_10px] yoo-embed-relative yoo-embed-flex"
      {...attributes}
      contentEditable={false}
    >
      <button
        type="button"
        className={`yoopta-button yoo-embed-p-[12px_36px_12px_12px] yoo-embed-flex yoo-embed-items-center yoo-embed-text-left yoo-embed-w-full yoo-embed-overflow-hidden yoo-embed-rounded-[3px] yoo-embed-text-[14px] yoo-embed-text-[rgba(55,53,47,0.65)] yoo-embed-relative yoo-embed-cursor-pointer yoo-embed-border-none yoo-embed-bg-[#efefef] yoo-embed-transition-[background-color_100ms_ease-in] hover:yoo-embed-bg-[#e3e3e3]`}
        onClick={() => setIsUploaderOpen(true)}
        ref={refs.setReference}
      >
        <CodeIcon className="yoo-embed-mr-2 yoo-embed-user-select-none" width={24} height={24} />
        <span className="yoo-embed-font-medium">
          {editor.getLabelText('plugins.Embed.options.placeholder.title') || 'Click to add embed'}
        </span>
      </button>
      {isUploaderOpen && (
        <EmbedUploader
          blockId={blockId}
          floatingStyles={floatingStyles}
          refs={refs}
          onClose={() => setIsUploaderOpen(false)}
          editor={editor}
        />
      )}
      {children}
    </div>
  );
};

export { Placeholder };
