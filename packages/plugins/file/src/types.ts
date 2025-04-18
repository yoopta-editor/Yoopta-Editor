import { type SlateElement } from '@yoopta/editor';

export type FileElementProps = {
  size: number | null;
  name: string | null;
  src: string | null;
  format?: string | null;
};

export type FilePluginElements = 'file';
export type FileElement = SlateElement<'file', FileElementProps>;

export type FileUploadResponse = Partial<FileElementProps> & { src: string };

export type FilePluginOptions = {
  onUpload?: (file: File) => Promise<FileUploadResponse>;
  onError?: (error: any) => void;
  accept?: string;
};

export type FileElementMap = {
  file: FileElement;
};
