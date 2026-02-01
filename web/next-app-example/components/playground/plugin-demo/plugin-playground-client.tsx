'use client';

import { PLUGIN_SLUG_TO_PLUGINS } from './plugin-map';
import { PluginDemoEditor } from './plugin-demo-editor';

type PluginPlaygroundClientProps = {
  slug: string;
};

export const PluginPlaygroundClient = ({ slug }: PluginPlaygroundClientProps) => {
  const plugins = PLUGIN_SLUG_TO_PLUGINS[slug];
  if (!plugins) return null;
  return <PluginDemoEditor plugins={plugins} slug={slug} />;
};
