import { PluginElementRenderProps } from '@yoopta/editor';

// https://ui.shadcn.com/docs/components/typography#h2
export function TypographyH2(props: PluginElementRenderProps) {
  return (
    <h2
      className="mt-10 scroll-m-20 !border-b pb-2 text-3xl font-semibold tracking-tight transition-colors"
      {...props.attributes}>
      {props.children}
    </h2>
  );
}
