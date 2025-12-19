import type { PluginElementRenderProps } from '@yoopta/editor';
import { useElementSelected } from '@yoopta/editor';

import type { MentionElementProps } from '../types';

const MentionRender = (props: PluginElementRenderProps) => {
  const { element, attributes, children } = props;
  const { id, name, avatar } = element.props as MentionElementProps;

  const { isElementSelected, isElementFocused } = useElementSelected();

  return (
    <span
      {...attributes}
      contentEditable={false}
      data-mention-id={id}
      className={`yoopta-mention-tag ${
        isElementSelected && isElementFocused ? 'yoopta-mention-tag-selected' : ''
      }`}>
      {avatar && (
        <img
          src={avatar}
          alt={name}
          width={16}
          height={16}
          loading="lazy"
          className="yoopta-mention-tag-avatar"
        />
      )}
      {name}
      {children}
    </span>
  );
};

export { MentionRender };
