import { useCallback, useState } from 'react';

import type {
  FileDeleteEndpointOptions,
  FileDeleteFn,
  FileDeleteOptions,
  FileElement,
  FileUploadEndpointOptions,
  FileUploadError,
  FileUploadFn,
  FileUploadOptions,
  FileUploadProgress,
  FileUploadResponse,
  FileUploadResult,
  FileUploadState,
  UseFileDeleteReturn,
  UseFileUploadReturn,
} from '../types';
import { useXHRRequest } from './use-xhr';

const DOCS_URL = 'https://docs.yoopta.dev/plugins/file';

// Type guard to check if options is a custom function
const isUploadFn = (
  options: FileUploadOptions,
): options is (file: File, onProgress?: (progress: FileUploadProgress) => void) => Promise<FileUploadResponse> =>
  typeof options === 'function';

// Type guard to check if delete options is a custom function
const isDeleteFn = (options: FileDeleteOptions): options is (element: FileElement) => Promise<void> =>
  typeof options === 'function';

// Validation helpers
const validateUploadOptions = (options: FileUploadOptions | undefined): void => {
  if (options === undefined || options === null) {
    throw new Error(
      `[Yoopta File] Upload options are not configured. ` +
      `Please provide 'upload' option when extending the File plugin.\n\n` +
      `Example:\n` +
      `File.extend({\n` +
      `  options: {\n` +
      `    upload: async (file) => {\n` +
      `      // Upload file to your storage and return file props\n` +
      `      return { src: '...', name: file.name, size: file.size };\n` +
      `    },\n` +
      `  },\n` +
      `})\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options !== 'function' && typeof options !== 'object') {
    throw new Error(
      `[Yoopta File] Invalid upload options. Expected a function or endpoint configuration object.\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options === 'object' && !options.endpoint) {
    throw new Error(
      `[Yoopta File] Missing 'endpoint' in upload options. ` +
      `When using endpoint-based upload, you must provide an 'endpoint' URL.\n\n` +
      `Example:\n` +
      `File.extend({\n` +
      `  options: {\n` +
      `    upload: {\n` +
      `      endpoint: '/api/upload-file',\n` +
      `    },\n` +
      `  },\n` +
      `})\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }
};

// Validation helper for delete options (optional - only validates if provided)
const validateDeleteOptions = (options: FileDeleteOptions | undefined): boolean => {
  // Delete is optional - return false if not configured
  if (options === undefined || options === null) {
    return false;
  }

  if (typeof options !== 'function' && typeof options !== 'object') {
    throw new Error(
      `[Yoopta File] Invalid delete options. Expected a function or endpoint configuration object.\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options === 'object' && !options.endpoint) {
    throw new Error(
      `[Yoopta File] Missing 'endpoint' in delete options. ` +
      `When using endpoint-based delete, you must provide an 'endpoint' URL.\n\n` +
      `Example:\n` +
      `File.extend({\n` +
      `  options: {\n` +
      `    delete: {\n` +
      `      endpoint: '/api/delete-file',\n` +
      `    },\n` +
      `  },\n` +
      `})\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  return true;
};

export const useFileDelete = (options: FileDeleteOptions | undefined): UseFileDeleteReturn => {
  // Validate options - returns false if not configured (optional)
  const isConfigured = validateDeleteOptions(options);

  const validOptions = isConfigured ? (options as FileDeleteOptions) : null;
  const isCustomFn = validOptions ? isDeleteFn(validOptions) : false;

  // State for custom function approach - always called
  const [customState, setCustomState] = useState<FileUploadState>({
    loading: false,
    progress: null,
    error: null,
    result: null,
  });

  // For endpoint-based approach - create endpoint options (use dummy if custom fn or not configured)
  const endpointOpts: FileDeleteEndpointOptions =
    !validOptions || isCustomFn ? { endpoint: '' } : (validOptions as FileDeleteEndpointOptions);

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
  const customDeleteFile = useCallback(
    async (element: FileElement): Promise<FileUploadResult> => {
      // If delete is not configured, just return success without actually deleting from storage
      if (!validOptions) {
        const src = element.props?.src ?? '';
        return { id: element.props?.id ?? '', url: src };
      }

      if (!isCustomFn) {
        throw new Error('Custom delete called but options is not a function');
      }

      const src = element.props?.src;
      if (!src) {
        throw new Error('File src is required');
      }

      setCustomState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        await (validOptions as FileDeleteFn)(element);
        const result: FileUploadResult = { id: element.props?.id ?? '', url: src };
        setCustomState((prev) => ({ ...prev, loading: false, result }));
        return result;
      } catch (err) {
        const error: FileUploadError = {
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
  const endpointDeleteFile = useCallback(
    (element: FileElement) => {
      const fileId = element.props?.id;
      if (!fileId) {
        throw new Error('File id is required');
      }
      return xhrResult.xhrFetch(JSON.stringify({ fileId }));
    },
    [xhrResult],
  );

  // Return appropriate implementation based on options type
  // If not configured, return no-op delete function
  if (!isConfigured) {
    return {
      ...customState,
      deleteFile: customDeleteFile,
      cancel: () => { },
      reset: customReset,
    };
  }

  if (isCustomFn) {
    return {
      ...customState,
      deleteFile: customDeleteFile,
      cancel: () => { },
      reset: customReset,
    };
  }

  return {
    loading: xhrResult.loading,
    progress: xhrResult.progress,
    error: xhrResult.error,
    result: xhrResult.result,
    deleteFile: endpointDeleteFile,
    cancel: xhrResult.cancel,
    reset: xhrResult.reset,
  };
};

export const useFileUpload = (options: FileUploadOptions | undefined): UseFileUploadReturn => {
  // Validate options - will throw descriptive error if invalid
  validateUploadOptions(options);

  // After validation, options is guaranteed to be defined
  const validOptions = options as FileUploadOptions;
  const isCustomFn = isUploadFn(validOptions);

  // State for custom function approach - always called
  const [customState, setCustomState] = useState<FileUploadState>({
    loading: false,
    progress: null,
    error: null,
    result: null,
  });

  // For endpoint-based approach - create endpoint options (use dummy if custom fn)
  const endpointOpts: FileUploadEndpointOptions = isCustomFn
    ? { endpoint: '' }
    : (validOptions as FileUploadEndpointOptions);

  // Always call useXHRRequest (with dummy options if using custom function)
  const xhrResult = useXHRRequest({
    endpoint: endpointOpts.endpoint,
    method: endpointOpts.method ?? 'POST',
    headers: endpointOpts.headers ?? {},
    fieldName: endpointOpts.fieldName ?? 'file',
    maxSize: endpointOpts.maxSize,
    accept: endpointOpts.accept,
    onSuccess: endpointOpts.onSuccess,
    onError: endpointOpts.onError,
    onProgress: endpointOpts.onProgress,
  });

  // Custom upload function - always defined with useCallback
  const customUpload = useCallback(
    async (file: File): Promise<FileUploadResult> => {
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
        const onProgress = (progress: FileUploadProgress) => {
          setCustomState((prev) => ({ ...prev, progress }));
        };

        const fileProps = await (validOptions as FileUploadFn)(file, onProgress);
        const result: FileUploadResult = {
          id: fileProps.id ?? '',
          url: fileProps.src ?? '',
          name: fileProps.name ?? file.name,
          size: fileProps.size ?? file.size,
          format: fileProps.format,
        };

        setCustomState((prev) => ({
          ...prev,
          loading: false,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
          result,
        }));

        return result;
      } catch (err) {
        const error: FileUploadError = {
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
      formData.append(endpointOpts.fieldName ?? 'yoopta-file', file);
      return xhrResult.xhrFetch(formData);
    },
    [endpointOpts.fieldName, xhrResult],
  );

  // Return appropriate implementation based on options type
  if (isCustomFn) {
    return {
      ...customState,
      upload: customUpload,
      cancel: () => { },
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
