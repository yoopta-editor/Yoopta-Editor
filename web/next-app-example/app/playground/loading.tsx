export default function PlaygroundLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-64 mx-auto mb-8" />
          <div className="h-[400px] bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800" />
        </div>
      </div>
    </div>
  );
}
