import { YooptaPlugin } from '@yoopta/editor';

const CodeGroupPlugin = new YooptaPlugin({
  type: 'CodeGroup',
  elements: (
    <code-group render={CodeGroupRender}>
      <code-filename-list render={CodeFilenameListRender}>
        <code-filename render={CodeFilenameRender} />
      </code-filename-list>
      <code render={CodeRender} />
    </code-group>
  ),
  options: {
    display: {
      title: 'Code Group',
      description: 'A group of code blocks',
    },
  },
});

export { CodeGroupPlugin };
