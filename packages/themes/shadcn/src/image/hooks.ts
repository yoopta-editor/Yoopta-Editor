import { useCallback, useRef, useState } from 'react';

type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

type UploadError = {
  message: string;
  code?: string;
  status?: number;
};

type UploadResult = {
  url: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  [key: string]: any;
};

type UploadState = {
  isUploading: boolean;
  progress: UploadProgress | null;
  error: UploadError | null;
  result: UploadResult | null;
};

type UseImageUploadOptions = {
  endpoint: string;
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  fieldName?: string;
  maxSize?: number;
  allowedTypes?: string[]; // ['image/jpeg', 'image/png', ...]
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: UploadError) => void;
  onProgress?: (progress: UploadProgress) => void;
};

type UseImageUploadReturn = {
  upload: (file: File) => Promise<UploadResult>;
  cancel: () => void;
  reset: () => void;
} & UploadState;

export const useImageUpload = (options: UseImageUploadOptions): UseImageUploadReturn => {
  const {
    endpoint,
    method = 'POST',
    headers = {},
    fieldName = 'file',
    maxSize,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    onSuccess,
    onError,
    onProgress,
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: null,
    error: null,
    result: null,
  });

  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const validateFile = useCallback(
    (file: File): UploadError | null => {
      if (!allowedTypes.includes(file.type)) {
        return {
          message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
          code: 'INVALID_TYPE',
        };
      }

      if (maxSize && file.size > maxSize) {
        const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
        return {
          message: `File size exceeds ${maxSizeMB}MB`,
          code: 'FILE_TOO_LARGE',
        };
      }

      return null;
    },
    [allowedTypes, maxSize],
  );

  const upload = useCallback(
    (file: File): Promise<UploadResult> =>
      new Promise((resolve, reject) => {
        const validationError = validateFile(file);
        if (validationError) {
          setState((prev) => ({
            ...prev,
            error: validationError,
          }));
          onError?.(validationError);
          reject(validationError);
          return;
        }

        setState({
          isUploading: true,
          progress: { loaded: 0, total: file.size, percentage: 0 },
          error: null,
          result: null,
        });

        const formData = new FormData();
        formData.append(fieldName, file);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            };

            setState((prev) => ({
              ...prev,
              progress,
            }));

            onProgress?.(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result: UploadResult = JSON.parse(xhr.responseText);

              setState((prev) => ({
                ...prev,
                isUploading: false,
                result,
              }));

              onSuccess?.(result);
              resolve(result);
            } catch (error) {
              const parseError: UploadError = {
                message: 'Failed to parse server response',
                code: 'PARSE_ERROR',
                status: xhr.status,
              };

              setState((prev) => ({
                ...prev,
                isUploading: false,
                error: parseError,
              }));

              onError?.(parseError);
              reject(parseError);
            }
          } else {
            const httpError: UploadError = {
              message: `Upload failed with status ${xhr.status}`,
              code: 'HTTP_ERROR',
              status: xhr.status,
            };

            setState((prev) => ({
              ...prev,
              isUploading: false,
              error: httpError,
            }));

            onError?.(httpError);
            reject(httpError);
          }
        });

        xhr.addEventListener('error', () => {
          const networkError: UploadError = {
            message: 'Network error occurred',
            code: 'NETWORK_ERROR',
          };

          setState((prev) => ({
            ...prev,
            isUploading: false,
            error: networkError,
          }));

          onError?.(networkError);
          reject(networkError);
        });

        xhr.addEventListener('abort', () => {
          const abortError: UploadError = {
            message: 'Upload cancelled',
            code: 'ABORT',
          };

          setState((prev) => ({
            ...prev,
            isUploading: false,
            error: abortError,
          }));

          reject(abortError);
        });

        xhr.addEventListener('timeout', () => {
          const timeoutError: UploadError = {
            message: 'Upload timeout',
            code: 'TIMEOUT',
          };

          setState((prev) => ({
            ...prev,
            isUploading: false,
            error: timeoutError,
          }));

          onError?.(timeoutError);
          reject(timeoutError);
        });

        xhr.open(method, endpoint);

        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });

        xhr.timeout = 30000;
        xhr.send(formData);
      }),
    [endpoint, method, headers, fieldName, validateFile, onSuccess, onError, onProgress],
  );

  const cancel = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: null,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    upload,
    cancel,
    reset,
  };
};

export const useImageDimensions = () => {
  const getDimensions = useCallback(
    (file: File): Promise<{ width: number; height: number }> =>
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
      }),
    [],
  );

  return { getDimensions };
};

export const useImagePreview = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const generatePreview = useCallback(
    (file: File) => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      const url = URL.createObjectURL(file);
      setPreview(url);

      return url;
    },
    [preview],
  );

  const clearPreview = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [preview]);

  return {
    preview,
    generatePreview,
    clearPreview,
  };
};
