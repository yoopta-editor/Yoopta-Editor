// Plugin
import { Embed } from './plugin/embed-plugin';

// Commands
export { EmbedCommands } from './commands';
export type { EmbedCommandsType } from './commands';

// Types
export type {
  EmbedAspectRatio,
  EmbedElement,
  EmbedElementMap,
  EmbedElementProps,
  EmbedPluginElements,
  EmbedPluginOptions,
  EmbedProvider,
  EmbedProviderMeta,
  EmbedProviderRenderProps,
  EmbedProviderType,
  EmbedSizes,
  OEmbedResponse,
  ProviderConfig,
} from './types';

// Hooks
export { useEmbedUrl } from './hooks/useEmbedUrl';
export type { UseEmbedUrlReturn, UseEmbedUrlState, UseEmbedUrlActions } from './hooks/useEmbedUrl';

// Utils
export {
  calculateEmbedDimensions,
  detectProvider,
  getOEmbedUrl,
  getProviderAspectRatio,
  getProviderConfig,
  getSupportedProviders,
  isEmbedUrl,
  parseEmbedUrl,
  PROVIDER_CONFIGS,
} from './utils/providers';

export {
  extractProviderMeta,
  fetchOEmbed,
  fetchOEmbedViaProxy,
} from './utils/oembed';

// Default export
export default Embed;
