export const PluginPlayground = ({ pluginSlug, height = 420 }) => {
  const baseUrl = 'http://localhost:3000';
  return (
    <div className="not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <iframe
        title={`${pluginSlug} plugin demo`}
        src={`${baseUrl}/playground/plugin/${pluginSlug}`}
        className="w-full border-0 bg-white dark:bg-zinc-900"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      />
    </div>
  );
};
