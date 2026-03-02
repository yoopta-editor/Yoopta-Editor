import type { YooEditor, YooptaPathIndex } from '@yoopta/editor';
import { Blocks, buildBlockData } from '@yoopta/editor';

import type { LogoCloudElement } from './types';

type InsertLogoCloudOptions = {
  at?: YooptaPathIndex;
  focus?: boolean;
};

export type LogoCloudCommands = {
  buildLogoCloudElements: (editor: YooEditor) => LogoCloudElement;
  insertLogoCloud: (editor: YooEditor, options?: Partial<InsertLogoCloudOptions>) => void;
  deleteLogoCloud: (editor: YooEditor, blockId: string) => void;
};

const DEFAULT_LOGOS = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Wayne Enterprises'];

export const LogoCloudCommands: LogoCloudCommands = {
  buildLogoCloudElements: (editor: YooEditor) => {
    const items = DEFAULT_LOGOS.map((name) =>
      editor.y('logo-item', {
        props: { color: '#374151', backgroundColor: '#f3f4f6' },
        children: [editor.y.text(name)],
      }),
    );

    return editor.y('logo-cloud', {
      props: {
        columns: 5,
        paddingY: 'lg',
        backgroundColor: '#ffffff',
        grayscale: false,
      },
      children: [
        editor.y('logo-cloud-heading', {
          props: { color: '#111827' },
          children: [editor.y.text('Trusted by innovative companies')],
        }),
        editor.y('logo-cloud-description', {
          props: { color: '#6b7280' },
          children: [editor.y.text('Join thousands of teams building with our platform')],
        }),
        ...items,
      ],
    }) as LogoCloudElement;
  },

  insertLogoCloud: (editor: YooEditor, options = {}) => {
    const { at, focus } = options;
    const cloud = LogoCloudCommands.buildLogoCloudElements(editor);
    const block = buildBlockData({ value: [cloud], type: 'LogoCloud' });
    Blocks.insertBlock(editor, block.type, { focus, at, blockData: block });
  },

  deleteLogoCloud: (editor: YooEditor, blockId) => {
    Blocks.deleteBlock(editor, { blockId });
  },
};
