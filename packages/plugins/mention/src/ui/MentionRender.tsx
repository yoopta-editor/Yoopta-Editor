import { PluginElementRenderProps, useElementSelected } from '@yoopta/editor';
import { MentionElementProps } from '../types';

const MentionRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, attributes, children } = props;
  const { mention } = element.props as MentionElementProps;

  const { selected, focused } = useElementSelected();

  return (
    <>
      <span
        {...attributes}
        contentEditable={false}
        data-mention-id={mention.id}
        className={`yoopta-mention-tag ${selected && focused ? 'yoopta-mention-tag-selected' : ''}`}
      >
        {mention.name}
        {children}
      </span>
    </>
  );
};

export { MentionRender };
