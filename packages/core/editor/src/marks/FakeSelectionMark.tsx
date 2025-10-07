import type { YooptaMarkProps } from '../plugins/types';

import { createYooptaMark } from '.';

type FakeSelectionMarkProps = YooptaMarkProps<'italic', boolean>;

const FakeSelectionMark = createYooptaMark({
  type: 'fakeSelection',
  render: (props: FakeSelectionMarkProps) => (
    <span style={{ backgroundColor: '#d7e6fa' }}>{props.children}</span>
  ),
});

export { FakeSelectionMark };
