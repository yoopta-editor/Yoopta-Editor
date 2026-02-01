import type { PluginElementRenderProps } from '@yoopta/editor';

export const StepListItemHeading = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <p
      {...attributes}
      data-component-part="step-title"
      className="mt-2 font-semibold prose dark:prose-invert text-foreground">
      {children}
    </p>
  );
};
