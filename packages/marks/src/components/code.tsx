import type { YooptaMarkProps } from '@yoopta/editor';
import { createYooptaMark } from '@yoopta/editor';

type CodeMarkProps = YooptaMarkProps<'code', boolean>;

export const CodeMark = createYooptaMark<CodeMarkProps>({
  type: 'code',
  hotkey: 'mod+e',
  render: (props) => <code className="yoopta-mark-code">{props.children}</code>,
});
