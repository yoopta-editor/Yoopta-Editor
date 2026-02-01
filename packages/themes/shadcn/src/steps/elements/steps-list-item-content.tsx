import type { PluginElementRenderProps } from '@yoopta/editor';

export const StepListItemContent = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <div
      {...attributes}
      data-component-part="step-content"
      className="my-2 prose dark:prose-invert">
      {children}
    </div>
  );
};
