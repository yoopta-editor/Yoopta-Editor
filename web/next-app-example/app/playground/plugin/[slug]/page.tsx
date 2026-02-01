import { notFound } from 'next/navigation';
import { PluginPlaygroundClient } from '@/components/playground/plugin-demo/plugin-playground-client';
import { PLUGIN_SLUGS } from '@/components/playground/plugin-demo/plugin-slugs';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PluginPlaygroundPage({ params }: PageProps) {
  const { slug } = await params;
  if (!PLUGIN_SLUGS.includes(slug as (typeof PLUGIN_SLUGS)[number])) notFound();
  return (
    <div className="min-h-screen pb-10 pt-4 px-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="mb-4 text-center">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
          {slug.replace(/-/g, ' ')} plugin
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Live demo — try the editor below
        </p>
      </div>
      <PluginPlaygroundClient slug={slug} />
    </div>
  );
}
