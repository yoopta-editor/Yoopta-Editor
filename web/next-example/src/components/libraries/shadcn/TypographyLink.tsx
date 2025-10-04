import { PluginElementRenderProps } from '@yoopta/editor';
import { LinkElementProps } from '@yoopta/link';

// https://ui.shadcn.com/docs/components/typography
export function TypographyLink(props: PluginElementRenderProps) {
  const { target, rel, url } = props.element.props as LinkElementProps;

  return (
    <a
      href={url || ''}
      target={target}
      rel={rel}
      className="font-medium text-primary underline underline-offset-4"
      {...props.attributes}>
      {props.children}
    </a>
  );
}
