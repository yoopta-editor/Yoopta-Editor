import { PluginElementRenderProps } from '@yoopta/editor';

// https://ui.shadcn.com/docs/components/typography#h1
export function TypographyH1(props: PluginElementRenderProps) {
  return (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
      {...props.attributes}>
      {props.children}
    </h1>
  );
}
