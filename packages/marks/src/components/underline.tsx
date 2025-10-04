import type { YooptaMarkProps } from '@yoopta/editor';
import { createYooptaMark } from '@yoopta/editor';

type UnderlineMarkProps = YooptaMarkProps<'underline', boolean>;

export const Underline = createYooptaMark<UnderlineMarkProps>({
  type: 'underline',
  hotkey: 'mod+u',
  render: (props) => <u className="yoo-marks-underline yoopta-mark-underline">{props.children}</u>,
});
