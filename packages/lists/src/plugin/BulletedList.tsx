import { YooptaPlugin } from '@yoopta/editor';
import { BulletedListRender } from '../elements/BulletedList';
import { onKeyDown } from '../events/onKeyDown';
import { BulletedListElement, BulletedListPluginKeys } from '../types';

const BulletedList = new YooptaPlugin<BulletedListPluginKeys, BulletedListElement>({
  type: 'BulletedList',
  elements: {
    'bulleted-list': {
      render: BulletedListRender,
    },
  },
  options: {
    display: {
      title: 'Bulleted List',
      description: 'Create bullet list',
    },
    shortcuts: ['-'],
  },
  events: {
    onKeyDown,
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['UL'],
      },
    },
  },
});

export { BulletedList };
