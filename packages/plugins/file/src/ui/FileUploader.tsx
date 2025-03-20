import { Elements, useYooptaEditor, useYooptaPluginOptions } from '@yoopta/editor';
import { FileElementProps, FilePluginElements, FilePluginOptions } from '../types';

type Props = {
  onClose: () => void;
  blockId: string;
  accept?: string;
  onSetLoading: (_s: boolean) => void;
};

const FileUploader = ({ accept = '', onClose, blockId, onSetLoading }: Props) => {
  const options = useYooptaPluginOptions<FilePluginOptions>('File');
  const editor = useYooptaEditor();

  const upload = async (file: File) => {
    if (!options?.onUpload) {
      throw new Error('onUpload not provided in plugin options. Check File.extend({}) method');
    }
    onClose();
    onSetLoading(true);

    try {
      // [TODO] - abort controller?
      const response = await options?.onUpload(file);

      Elements.updateElement<FilePluginElements, FileElementProps>(editor, blockId, {
        type: 'file',
        props: {
          src: response.src,
          name: response.name || file.name,
          size: response.size || file.size,
          format: response.format,
        },
      });
    } catch (error) {
      options?.onError?.(error);
    } finally {
      onSetLoading(false);
    }
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (file) upload(file);
  };

  return (
    <div className="yoo-file-user-select-none yoo-file-transition-bg yoo-file-duration-20 yoo-file-ease-in yoo-file-white-space-nowrap yoo-file-rounded-[4px] yoo-file-h-[32px] yoo-file-px-[12px] yoo-file-border yoo-file-border-solid yoo-file-border-[rgba(55,53,47,0.16)] yoo-file-w-full yoo-file-cursor-pointer">
      <label
        htmlFor="file-uploader"
        className="yoo-file-text-[14px] yoo-file-leading-[1.2] yoo-file-font-medium yoo-file-cursor-pointer yoo-file-w-full yoo-file-flex yoo-file-items-center yoo-file-justify-center yoo-file-h-full"
      >
        <input
          type="file"
          id="file-uploader"
          className="yoo-file-absolute yoo-file-left-0 yoo-file-top-0 yoo-file-invisible"
          accept={options?.accept || accept}
          onChange={onChange}
          multiple={false}
        />
        Upload file
      </label>
    </div>
  );
};

export { FileUploader };
