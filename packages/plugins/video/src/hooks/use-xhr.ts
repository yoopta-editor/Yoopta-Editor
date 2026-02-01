import { useCallback, useRef, useState } from 'react';

import type {
  VideoUploadProgress,
  VideoUploadError,
  VideoUploadResult,
  VideoUploadState,
  XHRRequestOptions,
} from '../types';

const validateFile = (file: File, accept?: string, maxSize?: number): VideoUploadError | null => {
  if (accept && !accept.includes(file.type)) {
    return {
      message: `Invalid file type. Allowed types: ${accept}`,
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
};

export const useXHRRequest = ({
  onError,
  onSuccess,
  onProgress,
  accept,
  maxSize,
  method = 'POST',
  endpoint,
  headers,
}: XHRRequestOptions) => {
  const [state, setState] = useState<VideoUploadState>({
    loading: false,
    progress: null,
    error: null,
    result: null,
  });

  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const xhrFetch = (body: XMLHttpRequestBodyInit): Promise<VideoUploadResult> =>
    new Promise((resolve, reject) => {
      if (body instanceof File) {
        const validationError = validateFile(body, accept, maxSize);
        if (validationError) {
          setState((prev) => ({
            ...prev,
            error: validationError,
          }));
          onError?.(validationError);
          reject(validationError);
          return;
        }
      }

      setState({
        loading: true,
        progress: { loaded: 0, total: body instanceof File ? body.size : 0, percentage: 0 },
        error: null,
        result: null,
      });

      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress: VideoUploadProgress = {
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
            const result: VideoUploadResult = JSON.parse(xhr.responseText);

            setState((prev) => ({
              ...prev,
              loading: false,
              result,
            }));

            onSuccess?.(result);
            resolve(result);
          } catch (error) {
            const parseError: VideoUploadError = {
              message: 'Failed to parse server response',
              code: 'PARSE_ERROR',
              status: xhr.status,
            };

            setState((prev) => ({
              ...prev,
              loading: false,
              error: parseError,
            }));

            onError?.(parseError);
            reject(parseError);
          }
        } else {
          const httpError: VideoUploadError = {
            message: `Upload failed with status ${xhr.status}`,
            code: 'HTTP_ERROR',
            status: xhr.status,
          };

          setState((prev) => ({
            ...prev,
            loading: false,
            error: httpError,
          }));

          onError?.(httpError);
          reject(httpError);
        }
      });

      xhr.addEventListener('error', () => {
        const networkError: VideoUploadError = {
          message: 'Network error occurred',
          code: 'NETWORK_ERROR',
        };

        setState((prev) => ({
          ...prev,
          loading: false,
          error: networkError,
        }));

        onError?.(networkError);
        reject(networkError);
      });

      xhr.addEventListener('abort', () => {
        const abortError: VideoUploadError = {
          message: 'Upload cancelled',
          code: 'ABORT',
        };

        setState((prev) => ({
          ...prev,
          loading: false,
          error: abortError,
        }));

        reject(abortError);
      });

      xhr.addEventListener('timeout', () => {
        const timeoutError: VideoUploadError = {
          message: 'Upload timeout',
          code: 'TIMEOUT',
        };

        setState((prev) => ({
          ...prev,
          loading: false,
          error: timeoutError,
        }));

        onError?.(timeoutError);
        reject(timeoutError);
      });

      xhr.open(method, endpoint);

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      // Videos can be large, so we use a longer timeout (5 minutes)
      xhr.timeout = 300000;
      xhr.send(body);
    });

  const cancel = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      progress: null,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    xhrFetch,
    cancel,
    reset,
  };
};
