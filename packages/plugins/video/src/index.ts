import { Video } from './plugin';
import { VideoElement, VideoElementProps, VideoPluginOptions, VideoUploadResponse } from './types';

export { VideoCommands } from './commands';
export { useVideoUpload, useVideoDelete, useVideoPosterUpload, useVideoPreview, useVideoDimensions } from './hooks/use-upload';
export { parseVideoUrl, buildVideoProvider, getEmbedUrl, getProvider, isValidVideoUrl, isProviderUrl, getSupportedProviders, isProviderSupported } from './utils/providers';

export default Video;
export { VideoElement, VideoElementProps, VideoUploadResponse, VideoPluginOptions };
