import type { YooptaMarkProps } from '@yoopta/editor';
import { createYooptaMark } from '@yoopta/editor';

type ItalicMarkProps = YooptaMarkProps<'italic', boolean>;

export const Italic = createYooptaMark<ItalicMarkProps>({
  type: 'italic',
  hotkey: 'mod+i',
  render: (props) => <i className="yoo-marks-italic yoopta-mark-italic">{props.children}</i>,
});
