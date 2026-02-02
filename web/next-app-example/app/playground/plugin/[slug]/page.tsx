import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PluginPlaygroundClient } from '@/components/playground/plugin-demo/plugin-playground-client';
import { PLUGIN_SLUGS } from '@/components/playground/plugin-demo/plugin-slugs';
import { Code2 } from 'lucide-react';

const SOURCE_URL =
  'https://github.com/Darginec05/Yoopta-Editor/tree/main/web/next-app-example/components/playground/plugin-demo';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PluginPlaygroundPage({ params }: PageProps) {
  const { slug } = await params;
  if (!PLUGIN_SLUGS.includes(slug as (typeof PLUGIN_SLUGS)[number])) notFound();
  return (
    <div className="min-h-screen pb-10 pt-4 px-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="text-center sm:text-left">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
            {slug.replace(/-/g, ' ')} plugin
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Live demo — try the editor below
          </p>
        </div>
        <Link
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <Code2 className="w-4 h-4" />
          View source
        </Link>
      </div>
      <PluginPlaygroundClient slug={slug} />
    </div>
  );
}
