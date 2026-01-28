import { useCallback, useState } from 'react';

import type {
  UseVideoDeleteReturn,
  UseVideoPosterUploadReturn,
  UseVideoUploadReturn,
  VideoDeleteEndpointOptions,
  VideoDeleteFn,
  VideoDeleteOptions,
  VideoElement,
  VideoPosterUploadEndpointOptions,
  VideoPosterUploadFn,
  VideoPosterUploadOptions,
  VideoUploadEndpointOptions,
  VideoUploadError,
  VideoUploadFn,
  VideoUploadOptions,
  VideoUploadPreview,
  VideoUploadProgress,
  VideoUploadResult,
  VideoUploadState,
} from '../types';
import { useXHRRequest } from './use-xhr';

const DOCS_URL = 'https://docs.yoopta.dev/plugins/video';

// Type guard to check if options is a custom function
const isUploadFn = (
  options: VideoUploadOptions,
): options is (file: File, onProgress?: (progress: VideoUploadProgress) => void) => Promise<any> =>
  typeof options === 'function';

// Type guard to check if delete options is a custom function
const isDeleteFn = (options: VideoDeleteOptions): options is (element: VideoElement) => Promise<void> =>
  typeof options === 'function';

// Type guard to check if poster upload options is a custom function
const isPosterUploadFn = (
  options: VideoPosterUploadOptions,
): options is (file: File, onProgress?: (progress: VideoUploadProgress) => void) => Promise<string> =>
  typeof options === 'function';

// Validation helpers
const validateUploadOptions = (options: VideoUploadOptions | undefined): void => {
  if (options === undefined || options === null) {
    throw new Error(
      `[Yoopta Video] Upload options are not configured. ` +
      `Please provide 'upload' option when extending the Video plugin.\n\n` +
      `Example:\n` +
      `Video.extend({\n` +
      `  options: {\n` +
      `    upload: async (file) => {\n` +
      `      // Upload file to your storage and return video props\n` +
      `      return { id: '...', src: '...' };\n` +
      `    },\n` +
      `  },\n` +
      `})\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options !== 'function' && typeof options !== 'object') {
    throw new Error(
      `[Yoopta Video] Invalid upload options. Expected a function or endpoint configuration object.\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options === 'object' && !options.endpoint) {
    throw new Error(
      `[Yoopta Video] Missing 'endpoint' in upload options. ` +
      `When using endpoint-based upload, you must provide an 'endpoint' URL.\n\n` +
      `Example:\n` +
      `Video.extend({\n` +
      `  options: {\n` +
      `    upload: {\n` +
      `      endpoint: '/api/upload-video',\n` +
      `    },\n` +
      `  },\n` +
      `})\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }
};

// Validation helper for delete options (optional - only validates if provided)
const validateDeleteOptions = (options: VideoDeleteOptions | undefined): boolean => {
  // Delete is optional - return false if not configured
  if (options === undefined || options === null) {
    return false;
  }

  if (typeof options !== 'function' && typeof options !== 'object') {
    throw new Error(
      `[Yoopta Video] Invalid delete options. Expected a function or endpoint configuration object.\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options === 'object' && !options.endpoint) {
    throw new Error(
      `[Yoopta Video] Missing 'endpoint' in delete options. ` +
      `When using endpoint-based delete, you must provide an 'endpoint' URL.\n\n` +
      `Example:\n` +
      `Video.extend({\n` +
      `  options: {\n` +
      `    delete: {\n` +
      `      endpoint: '/api/delete-video',\n` +
      `    },\n` +
      `  },\n` +
      `})\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  return true;
};

const validatePosterUploadOptions = (options: VideoPosterUploadOptions | undefined): void => {
  if (options === undefined || options === null) {
    throw new Error(
      `[Yoopta Video] Poster upload options are not configured. ` +
      `Please provide 'uploadPoster' option when extending the Video plugin.\n\n` +
      `Example:\n` +
      `Video.extend({\n` +
      `  options: {\n` +
      `    uploadPoster: async (file) => {\n` +
      `      // Upload poster image and return URL\n` +
      `      return 'https://...';\n` +
      `    },\n` +
      `  },\n` +
      `})\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options !== 'function' && typeof options !== 'object') {
    throw new Error(
      `[Yoopta Video] Invalid poster upload options. Expected a function or endpoint configuration object.\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }

  if (typeof options === 'object' && !options.endpoint) {
    throw new Error(
      `[Yoopta Video] Missing 'endpoint' in poster upload options. ` +
      `When using endpoint-based upload, you must provide an 'endpoint' URL.\n\n` +
      `Example:\n` +
      `Video.extend({\n` +
      `  options: {\n` +
      `    uploadPoster: {\n` +
      `      endpoint: '/api/upload-poster',\n` +
      `    },\n` +
      `  },\n` +
      `})\n\n` +
      `See documentation: ${DOCS_URL}`,
    );
  }
};

export const useVideoDelete = (options: VideoDeleteOptions | undefined): UseVideoDeleteReturn => {
  // Validate options - returns false if not configured (optional)
  const isConfigured = validateDeleteOptions(options);

  const validOptions = isConfigured ? (options as VideoDeleteOptions) : null;
  const isCustomFn = validOptions ? isDeleteFn(validOptions) : false;

  // State for custom function approach - always called
  const [customState, setCustomState] = useState<VideoUploadState>({
    loading: false,
    progress: null,
    error: null,
    result: null,
  });

  // For endpoint-based approach - create endpoint options (use dummy if custom fn or not configured)
  const endpointOpts: VideoDeleteEndpointOptions =
    !validOptions || isCustomFn ? { endpoint: '' } : (validOptions as VideoDeleteEndpointOptions);

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
  const customDeleteVideo = useCallback(
    async (element: VideoElement): Promise<VideoUploadResult> => {
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
        throw new Error('Video src is required');
      }

      setCustomState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        await (validOptions as VideoDeleteFn)(element);
        const result: VideoUploadResult = { id: element.props?.id ?? '', url: src };
        setCustomState((prev) => ({ ...prev, loading: false, result }));
        return result;
      } catch (err) {
        const error: VideoUploadError = {
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
  const endpointDeleteVideo = useCallback(
    (element: VideoElement) => {
      const fileId = element.props?.id;
      if (!fileId) {
        throw new Error('Video id is required');
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
      deleteVideo: customDeleteVideo,
      cancel: () => { },
      reset: customReset,
    };
  }

  if (isCustomFn) {
    return {
      ...customState,
      deleteVideo: customDeleteVideo,
      cancel: () => { },
      reset: customReset,
    };
  }

  return {
    loading: xhrResult.loading,
    progress: xhrResult.progress,
    error: xhrResult.error,
    result: xhrResult.result,
    deleteVideo: endpointDeleteVideo,
    cancel: xhrResult.cancel,
    reset: xhrResult.reset,
  };
};

export const useVideoUpload = (options: VideoUploadOptions | undefined): UseVideoUploadReturn => {
  // Validate options - will throw descriptive error if invalid
  validateUploadOptions(options);

  // After validation, options is guaranteed to be defined
  const validOptions = options as VideoUploadOptions;
  const isCustomFn = isUploadFn(validOptions);

  // State for custom function approach - always called
  const [customState, setCustomState] = useState<VideoUploadState>({
    loading: false,
    progress: null,
    error: null,
    result: null,
  });

  // For endpoint-based approach - create endpoint options (use dummy if custom fn)
  const endpointOpts: VideoUploadEndpointOptions = isCustomFn
    ? { endpoint: '' }
    : (validOptions as VideoUploadEndpointOptions);

  // Always call useXHRRequest (with dummy options if using custom function)
  const xhrResult = useXHRRequest({
    endpoint: endpointOpts.endpoint,
    method: endpointOpts.method ?? 'POST',
    headers: endpointOpts.headers ?? {},
    fieldName: endpointOpts.fieldName ?? 'file',
    maxSize: endpointOpts.maxSize,
    accept: endpointOpts.accept ?? 'video/mp4, video/webm, video/ogg, video/quicktime',
    onSuccess: endpointOpts.onSuccess,
    onError: endpointOpts.onError,
    onProgress: endpointOpts.onProgress,
  });

  // Custom upload function - always defined with useCallback
  const customUpload = useCallback(
    async (file: File): Promise<VideoUploadResult> => {
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
        const onProgress = (progress: VideoUploadProgress) => {
          setCustomState((prev) => ({ ...prev, progress }));
        };

        const videoProps = await (validOptions as VideoUploadFn)(file, onProgress);
        const result: VideoUploadResult = {
          id: videoProps.id ?? '',
          url: videoProps.src ?? '',
          poster: videoProps.poster,
          width: typeof videoProps.sizes?.width === 'number' ? videoProps.sizes.width : undefined,
          height: typeof videoProps.sizes?.height === 'number' ? videoProps.sizes.height : undefined,
          provider: videoProps.provider,
        };

        setCustomState((prev) => ({
          ...prev,
          loading: false,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
          result,
        }));

        return result;
      } catch (err) {
        const error: VideoUploadError = {
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
      formData.append(endpointOpts.fieldName ?? 'yoopta-video-file', file);
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

export const useVideoPosterUpload = (
  options: VideoPosterUploadOptions | undefined,
): UseVideoPosterUploadReturn => {
  // Validate options - will throw descriptive error if invalid
  validatePosterUploadOptions(options);

  // After validation, options is guaranteed to be defined
  const validOptions = options as VideoPosterUploadOptions;
  const isCustomFn = isPosterUploadFn(validOptions);

  // State for custom function approach - always called
  const [customState, setCustomState] = useState<VideoUploadState>({
    loading: false,
    progress: null,
    error: null,
    result: null,
  });

  // For endpoint-based approach - create endpoint options (use dummy if custom fn)
  const endpointOpts: VideoPosterUploadEndpointOptions = isCustomFn
    ? { endpoint: '' }
    : (validOptions as VideoPosterUploadEndpointOptions);

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
  const customUploadPoster = useCallback(
    async (file: File): Promise<string> => {
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
        const onProgress = (progress: VideoUploadProgress) => {
          setCustomState((prev) => ({ ...prev, progress }));
        };

        const posterUrl = await (validOptions as VideoPosterUploadFn)(file, onProgress);
        const result: VideoUploadResult = {
          id: '',
          url: posterUrl,
        };

        setCustomState((prev) => ({
          ...prev,
          loading: false,
          progress: { loaded: file.size, total: file.size, percentage: 100 },
          result,
        }));

        return posterUrl;
      } catch (err) {
        const error: VideoUploadError = {
          message: err instanceof Error ? err.message : 'Poster upload failed',
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
  const endpointUploadPoster = useCallback(
    async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append(endpointOpts.fieldName ?? 'yoopta-poster-file', file);
      const result = await xhrResult.xhrFetch(formData);
      return result.url;
    },
    [endpointOpts.fieldName, xhrResult],
  );

  // Return appropriate implementation based on options type
  if (isCustomFn) {
    return {
      ...customState,
      uploadPoster: customUploadPoster,
      cancel: () => { },
      reset: customReset,
    };
  }

  return {
    loading: xhrResult.loading,
    progress: xhrResult.progress,
    error: xhrResult.error,
    result: xhrResult.result,
    uploadPoster: endpointUploadPoster,
    cancel: xhrResult.cancel,
    reset: xhrResult.reset,
  };
};

export const useVideoDimensions = () => {
  const getDimensions = (file: File): Promise<{ width: number; height: number; duration: number }> =>
    new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
        });
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video'));
      };

      video.src = url;
    });

  return { getDimensions };
};

export const useVideoPreview = () => {
  const [preview, setPreview] = useState<VideoUploadPreview | null>(null);

  const generatePreview = (file: File): VideoUploadPreview => {
    if (preview) {
      URL.revokeObjectURL(preview.url);
    }

    const url = URL.createObjectURL(file);
    const newPreview: VideoUploadPreview = { url };
    setPreview(newPreview);

    return newPreview;
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
