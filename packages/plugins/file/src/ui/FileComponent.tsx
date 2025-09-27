import { FileElementProps } from '../types';
import { FileTextIcon } from '@radix-ui/react-icons';
import { MouseEvent } from 'react';

type FileComponentProps = Partial<FileElementProps> & {
  blockId: string;
  align?: 'left' | 'center' | 'right';
};

function formatBytesToKilobytes(bytes) {
  if (typeof bytes !== 'number' || isNaN(bytes)) {
    return null;
  }
  const kilobytes = bytes / 1024;
  return kilobytes.toFixed(2) + ' KB';
}

const FileComponent = ({ name, src, size, format, align }: FileComponentProps) => {
  if (!src) return null;

  const onOpen = (e: MouseEvent) => {
    if (!src) return;
    e.preventDefault();
    e.stopPropagation();

    window.open(src, '_blank');
  };

  const currentAlign = align || 'left';
  const alignClass = `yoopta-align-${currentAlign}`;

  return (
    <div
      className="yoo-file-w-full yoo-file-cursor-pointer"
      contentEditable={false}
      onClick={onOpen}>
      <div
        className={`yoo-file-flex ${alignClass} yoo-file-items-center yoo-file-rounded-[4px] yoo-file-py-[8px] yoo-file-px-2 hover:yoo-file-bg-[rgba(55,53,47,0.04)] yoo-file-border-b-[1px] hover:yoo-file-border-[rgba(55,53,47,0.16)] yoo-file-border-[transparent]`}>
        <div className="yoo-file-flex yoo-file-items-center yoo-file-leading-[1.2] yoo-file-font-medium yoo-file-text-[#000000]">
          <FileTextIcon width={16} height={16} />
          <span className="yoo-file-ml-[6px] yoo-file-text-[14px]">
            {format ? `${name}.${format}` : `${name}`}
          </span>
        </div>
        <div className="yoo-file-ml-[8px] yoo-file-text-[10px] yoo-file-font-normal yoo-file-text-[#37352fa6]">
          {formatBytesToKilobytes(size)}
        </div>
      </div>
    </div>
  );
};

export { FileComponent, FileComponentProps };
