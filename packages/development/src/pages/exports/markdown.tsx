import dynamic from 'next/dynamic';

const MarkdownPreview = dynamic(
  () =>
    import('@/components/Exports/markdown/MarkdownPreview/MarkdownPreview').then(
      (mod) => mod.MarkdownPreview,
    ),
  { ssr: false },
);

export default function MarkdownExports() {
  return <MarkdownPreview />;
}
