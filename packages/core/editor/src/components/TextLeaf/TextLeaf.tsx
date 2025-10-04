import type { HTMLAttributes } from 'react';
import type { RenderLeafProps } from 'slate-react';
import { useSelected } from 'slate-react';

import type { ExtendedLeafProps } from '../../plugins/types';

type Props = Pick<ExtendedLeafProps<any, any>, 'attributes' | 'children'> & {
  placeholder?: string;
};

const TextLeaf = ({ children, attributes, placeholder }: Props) => {
  const selected = useSelected();

  const attrs: HTMLAttributes<HTMLSpanElement> & RenderLeafProps['attributes'] = {
    ...attributes,
  };

  if (selected && placeholder) {
    attrs['data-placeholder'] = placeholder;
    attrs.className = `yoopta-placeholder`;
  }

  return <span {...attrs}>{children}</span>;
};

export { TextLeaf };
