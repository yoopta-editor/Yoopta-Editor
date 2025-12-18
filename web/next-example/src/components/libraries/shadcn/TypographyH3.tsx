import { PluginElementRenderProps } from '@yoopta/editor';

// https://ui.shadcn.com/docs/components/typography#h3
export function TypographyH3(props: PluginElementRenderProps) {
  return (
    <h3 className="mt-4 scroll-m-20 text-2xl font-semibold tracking-tight" {...props.attributes}>
      {props.children}
    </h3>
  );
}
