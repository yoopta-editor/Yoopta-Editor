import type { PluginElementRenderProps } from '@yoopta/editor';

export const StepList = (props: PluginElementRenderProps) => {
  const { attributes, children } = props;

  return (
    <div {...attributes} className="[&>div]:contents contents">
      {children}
    </div>
  );
};
