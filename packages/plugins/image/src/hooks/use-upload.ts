import { useState } from 'react';

import type {
  ImageElement,
  ImageUploadOptions,
  ImageUploadPreview,
  UseImageDeleteReturn,
  UseImageUploadReturn,
} from '../types';
import { useXHRRequest } from './use-xhr';

export const useImageDelete = (options: ImageUploadOptions): UseImageDeleteReturn => {
  const {
    endpoint,
    method = 'DELETE',
    headers = {},
    fieldName = 'file',
    onSuccess,
    onError,
    onProgress,
  } = options;

  const { xhrFetch, cancel, reset, loading, progress, error, result } = useXHRRequest({
    onError,
    onSuccess,
    onProgress,
    fieldName,
    method,
    endpoint,
    headers,
  });

  const deleteImage = (element: ImageElement) => {
    const fileId = element.props?.id;
    if (!fileId) {
      throw new Error('FileId is required');
    }
    return xhrFetch(JSON.stringify({ fileId }));
  };

  return {
    loading,
    progress,
    error,
    result,
    deleteImage,
    cancel,
    reset,
  };
};

export const useImageUpload = (options: ImageUploadOptions): UseImageUploadReturn => {
  const {
    endpoint,
    method = 'POST',
    headers = {},
    fieldName = 'file',
    maxSize,
    accept = 'image/jpeg, image/jpg, image/png, image/gif, image/webp',
    onSuccess,
    onError,
    onProgress,
  } = options;

  const { xhrFetch, cancel, reset, loading, progress, error, result } = useXHRRequest({
    onError,
    onSuccess,
    onProgress,
    fieldName,
    accept,
    maxSize,
    method,
    endpoint,
    headers,
  });

  const upload = (file: File) => {
    const formData = new FormData();
    formData.append(fieldName ?? 'yoopta-image-file', file);
    return xhrFetch(formData);
  };

  return {
    loading,
    progress,
    error,
    result,
    upload,
    cancel,
    reset,
  };
};

export const useImageDimensions = () => {
  const getDimensions = (file: File): Promise<{ width: number; height: number }> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });

  return { getDimensions };
};

export const useImagePreview = () => {
  const [preview, setPreview] = useState<ImageUploadPreview | null>(null);
  // const { getDimensions } = useImageDimensions();

  const generatePreview = (file: File) => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
    }

    // const sizes = await getDimensions(file);

    const url = URL.createObjectURL(file);
    setPreview({ url });

    return { url };
  };

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
      setPreview(null);
    }
  };

  return {
    preview,
    generatePreview,
    clearPreview,
  };
};
