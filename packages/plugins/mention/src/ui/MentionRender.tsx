import { PluginElementRenderProps, useElementSelected } from '@yoopta/editor';
import { MentionElementProps } from '../types';

const MentionRender = ({ extendRender, ...props }: PluginElementRenderProps) => {
  const { element, attributes, children } = props;
  const { id, name, avatar } = element.props as MentionElementProps;

  const { selected, focused } = useElementSelected();

  return (
    <>
      <span
        {...attributes}
        contentEditable={false}
        data-mention-id={id}
        className={`yoopta-mention-tag ${selected && focused ? 'yoopta-mention-tag-selected' : ''}`}
      >
        {avatar && (
          <img src={avatar} alt={name} width={16} height={16} loading="lazy" className="yoopta-mention-tag-avatar" />
        )}
        {name}
        {children}
      </span>
    </>
  );
};

export { MentionRender };
