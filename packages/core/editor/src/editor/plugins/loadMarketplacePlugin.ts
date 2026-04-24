import type { YooptaPlugin } from '../../plugins';
import type { SlateElement } from '../types';

export type MarketplacePluginModule = {
  default: YooptaPlugin<Record<string, SlateElement>>;
  [key: string]: unknown;
}

/**
 * Dynamically loads a plugin from a URL (ESM bundle).
 *
 * Usage:
 * ```ts
 * const { plugin, module } = await loadMarketplacePlugin(
 *   'https://marketplace.yoopta.dev/plugins/image-gallery/1.0.0/bundle.mjs'
 * );
 * editor.registerPlugin(plugin);
 * ```
 *
 * The bundle must have a default export that is a YooptaPlugin instance.
 */
// Use Function constructor so bundlers (Turbopack, webpack, Rollup) cannot
// statically analyse this import — magic comments like webpackIgnore are
// stripped by Terser before they reach Turbopack's resolver.
const dynamicImport = new Function('url', 'return import(url)') as (url: string) => Promise<unknown>;

export async function loadMarketplacePlugin(bundleUrl: string): Promise<{
  plugin: YooptaPlugin<Record<string, SlateElement>>;
  module: MarketplacePluginModule;
}> {
  const module = (await dynamicImport(bundleUrl)) as MarketplacePluginModule;

  if (!module.default) {
    throw new Error(
      `[Yoopta] Plugin bundle at "${bundleUrl}" has no default export. ` +
      `Expected: export default YooptaPluginInstance;`,
    );
  }

  return { plugin: module.default, module };
}
