import type { MetaExtension } from './types';

export function createMetaExtension<K extends string, V>(config: MetaExtension<K, V>): MetaExtension<K, V> {
  return config;
}
