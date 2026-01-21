import { useCallback, useState } from 'react';

import type {
  ImageDeleteEndpointOptions,
  ImageDeleteOptions,
  ImageElement,
  ImageElementProps,
  ImageUploadEndpointOptions,
  ImageUploadFn,
  ImageUploadOptions,
  ImageUploadPreview,
  ImageUploadProgress,
  UploadError,
  UploadResult,
  UploadState,
  UseImageDeleteReturn,
  UseImageUploadReturn,
} from '../types';
import { useXHRRequest } from './use-xhr';

const DOCS_URL = 'https://yoopta.dev/docs/plugins/image';

// Type guard to check if options is a custom function
const isUploadFn = (
  options: ImageUploadOptions,
): options is (file: File, onProgress?: (progress: ImageUploadProgress) => void) => Promise<ImageElementProps> =>
  typeof options === 'function';

// Type guard to check if delete options is a custom function
const isDeleteFn = (options: ImageDeleteOptions): options is (src: string) => Promise<void> =>
  typeof options === 'function';

// Validation helpers
const validateUploadOptions = (options: ImageUploadOptions | undefined): void => {
  if (options === undefined || options === null) {
    throw new Error(
      `[Yoopta Image] Upload options are not configured. ` +
        `Please provide 'upload' option when extending the Image plugin.\n\n` +
        `Example:\n` +
        `Image.extend({\n` +
        `  options: {\n` +
        `    upload: async (file) => {\n` +
        `      // Upload file to your storage and return image props\n` +
        `      return { id: '...', src: '...' };\n` +
        `    },\n` +
        `  },\n` +
        `})\n\n` +
        `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options !== 'function' && typeof options !== 'object') {
    throw new Error(
      `[Yoopta Image] Invalid upload options. Expected a function or endpoint configuration object.\n\n` +
        `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options === 'object' && !options.endpoint) {
    throw new Error(
      `[Yoopta Image] Missing 'endpoint' in upload options. ` +
        `When using endpoint-based upload, you must provide an 'endpoint' URL.\n\n` +
        `Example:\n` +
        `Image.extend({\n` +
        `  options: {\n` +
        `    upload: {\n` +
        `      endpoint: '/api/upload-image',\n` +
        `    },\n` +
        `  },\n` +
        `})\n\n` +
        `See documentation: ${DOCS_URL}`,
    );
  }
};

const validateDeleteOptions = (options: ImageDeleteOptions | undefined): void => {
  if (options === undefined || options === null) {
    throw new Error(
      `[Yoopta Image] Delete options are not configured. ` +
        `Please provide 'delete' option when extending the Image plugin.\n\n` +
        `Example:\n` +
        `Image.extend({\n` +
        `  options: {\n` +
        `    delete: async (src) => {\n` +
        `      // Delete file from your storage\n` +
        `    },\n` +
        `  },\n` +
        `})\n\n` +
        `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options !== 'function' && typeof options !== 'object') {
    throw new Error(
      `[Yoopta Image] Invalid delete options. Expected a function or endpoint configuration object.\n\n` +
        `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options === 'object' && !options.endpoint) {
    throw new Error(
      `[Yoopta Image] Missing 'endpoint' in delete options. ` +
        `When using endpoint-based delete, you must provide an 'endpoint' URL.\n\n` +
        `Example:\n` +
        `Image.extend({\n` +
        `  options: {\n` +
        `    delete: {\n` +
        `      endpoint: '/api/delete-image',\n` +
        `    },\n` +
        `  },\n` +
        `})\n\n` +
        `See documentation: ${DOCS_URL}`,
    );
  }
};

export const useImageDelete = (options: ImageDeleteOptions | undefined): UseImageDeleteReturn => {
  // Validate options - will throw descriptive error if invalid
  validateDeleteOptions(options);

  // After validation, options is guaranteed to be defined
  const validOptions = options as ImageDeleteOptions;
  const isCustomFn = isDeleteFn(validOptions);

  // State for custom function approach - always called
  const [customState, setCustomState] = useState<UploadState>({
    loading: false,
    progress: null,
    error: null,
    result: null,
  });

  // For endpoint-based approach - create endpoint options (use dummy if custom fn)
  const endpointOpts: ImageDeleteEndpointOptions = isCustomFn
    ? { endpoint: '' }
    : (validOptions as ImageDeleteEndpointOptions);

  // Always call useXHRRequest (with dummy options if using custom function)
  const xhrResult = useXHRRequest({
    endpoint: endpointOpts.endpoint,
    method: endpointOpts.method ?? 'DELETE',
    headers: endpointOpts.headers ?? {},
    fieldName: endpointOpts.fieldName ?? 'file',
    onSuccess: endpointOpts.onSuccess,
    onError: endpointOpts.onError,
    onProgress: endpointOpts.onProgress,
  });

  // Custom delete function - always defined with useCallback
  const customDeleteImage = useCallback(
    async (element: ImageElement): Promise<UploadResult> => {
      if (!isCustomFn) {
        throw new Error('Custom delete called but options is not a function');
      }

      const src = element.props?.src;
      if (!src) {
        throw new Error('Image src is required');
      }

      setCustomState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        await (validOptions as (src: string) => Promise<void>)(src);
        const result: UploadResult = { id: element.props?.id ?? '', url: src };
        setCustomState((prev) => ({ ...prev, loading: false, result }));
        return result;
      } catch (err) {
        const error: UploadError = {
          message: err instanceof Error ? err.message : 'Delete failed',
          code: 'CUSTOM_DELETE_ERROR',
        };
        setCustomState((prev) => ({ ...prev, loading: false, error }));
        throw error;
      }
    },
    [validOptions, isCustomFn],
  );

  const customReset = useCallback(() => {
    setCustomState({ loading: false, progress: null, error: null, result: null });
  }, []);

  // Endpoint-based delete function
  const endpointDeleteImage = useCallback(
    (element: ImageElement) => {
      const fileId = element.props?.id;
      if (!fileId) {
        throw new Error('FileId is required');
      }
      return xhrResult.xhrFetch(JSON.stringify({ fileId }));
    },
    [xhrResult],
  );

  // Return appropriate implementation based on options type
  if (isCustomFn) {
    return {
      ...customState,
      deleteImage: customDeleteImage,
      cancel: () => {},
      reset: customReset,
    };
  }

  return {
    loading: xhrResult.loading,
    progress: xhrResult.progress,
    error: xhrResult.error,
    result: xhrResult.result,
    deleteImage: endpointDeleteImage,
    cancel: xhrResult.cancel,
    reset: xhrResult.reset,
  };
};

export const useImageUpload = (options: ImageUploadOptions | undefined): UseImageUploadReturn => {
  // Validate options - will throw descriptive error if invalid
  validateUploadOptions(options);

  // After validation, options is guaranteed to be defined
  const validOptions = options as ImageUploadOptions;
  const isCustomFn = isUploadFn(validOptions);

  // State for custom function approach - always called
  const [customState, setCustomState] = useState<UploadState>({
    loading: false,
    progress: null,
    error: null,
    result: null,
  });

  // For endpoint-based approach - create endpoint options (use dummy if custom fn)
  const endpointOpts: ImageUploadEndpointOptions = isCustomFn
    ? { endpoint: '' }
    : (validOptions as ImageUploadEndpointOptions);

  // Always call useXHRRequest (with dummy options if using custom function)
  const xhrResult = useXHRRequest({
    endpoint: endpointOpts.endpoint,
    method: endpointOpts.method ?? 'POST',
    headers: endpointOpts.headers ?? {},
    fieldName: endpointOpts.fieldName ?? 'file',
    maxSize: endpointOpts.maxSize,
    accept: endpointOpts.accept ?? 'image/jpeg, image/jpg, image/png, image/gif, image/webp',
    onSuccess: endpointOpts.onSuccess,
    onError: endpointOpts.onError,
    onProgress: endpointOpts.onProgress,
  });

  // Custom upload function - always defined with useCallback
  const customUpload = useCallback(
    async (file: File): Promise<UploadResult> => {
      if (!isCustomFn) {
        throw new Error('Custom upload called but options is not a function');
      }

      setCustomState((prev) => ({
        ...prev,
        loading: true,
        progress: { loaded: 0, total: file.size, percentage: 0 },
        error: null,
      }));

      try {
        const onProgress = (progress: ImageUploadProgress) => {
          setCustomState((prev) => ({ ...prev, progress }));
        };

        const imageProps = await (validOptions as ImageUploadFn)(file, onProgress);
        const result: UploadResult = {
          id: imageProps.id ?? '',
          url: imageProps.src ?? '',
          width: typeof imageProps.sizes?.width === 'number' ? imageProps.sizes.width : undefined,
          height: typeof imageProps.sizes?.height === 'number' ? imageProps.sizes.height : undefined,
        };

        setCustomState((prev) => ({
          ...prev,
          loading: false,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
          result,
        }));

        return result;
      } catch (err) {
        const error: UploadError = {
          message: err instanceof Error ? err.message : 'Upload failed',
          code: 'CUSTOM_UPLOAD_ERROR',
        };
        setCustomState((prev) => ({ ...prev, loading: false, error }));
        throw error;
      }
    },
    [validOptions, isCustomFn],
  );

  const customReset = useCallback(() => {
    setCustomState({ loading: false, progress: null, error: null, result: null });
  }, []);

  // Endpoint-based upload function
  const endpointUpload = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append(endpointOpts.fieldName ?? 'yoopta-image-file', file);
      return xhrResult.xhrFetch(formData);
    },
    [endpointOpts.fieldName, xhrResult],
  );

  // Return appropriate implementation based on options type
  if (isCustomFn) {
    return {
      ...customState,
      upload: customUpload,
      cancel: () => {},
      reset: customReset,
    };
  }

  return {
    loading: xhrResult.loading,
    progress: xhrResult.progress,
    error: xhrResult.error,
    result: xhrResult.result,
    upload: endpointUpload,
    cancel: xhrResult.cancel,
    reset: xhrResult.reset,
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

  const generatePreview = (file: File) => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
    }

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
