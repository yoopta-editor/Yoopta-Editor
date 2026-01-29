import type { PluginElementRenderProps } from '@yoopta/editor';
import { YooptaPlugin, generateId } from '@yoopta/editor';

import { TableOfContentsCommands } from '../commands';
import type {
  TableOfContentsElementMap,
  TableOfContentsElementProps,
} from '../types';
import { DEFAULT_HEADING_TYPES } from '../types';

const defaultTocProps: TableOfContentsElementProps = {
  depth: 3,
  title: 'Table of Contents',
  headingTypes: [...DEFAULT_HEADING_TYPES],
  showNumbers: false,
  collapsible: false,
};

/** Minimal fallback render; use a theme (e.g. @yoopta/themes-shadcn) for full UI. */
const TableOfContentsRender = (props: PluginElementRenderProps) => (
  <div {...props.attributes} contentEditable={false} data-type="table-of-contents">
    {props.children}
  </div>
);

const TableOfContents = new YooptaPlugin<TableOfContentsElementMap>({
  type: 'TableOfContents',
  elements: (
    <table-of-contents
      render={TableOfContentsRender}
      props={defaultTocProps}
      nodeType="void"
    />
  ),
  options: {
    display: {
      title: 'Table of Contents',
      description: 'Insert a table of contents from document headings',
    },
    shortcuts: ['toc', 'table of contents', 'contents'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['NAV', 'DIV'],
        parse: (el) => {
          const isToc =
            el.getAttribute('data-type') === 'table-of-contents' ||
            el.classList.contains('yoopta-table-of-contents');
          if (!isToc) return;

          const depth = Number(el.getAttribute('data-depth')) || 3;
          const title = el.getAttribute('data-title') ?? defaultTocProps.title;
          const showNumbers = el.getAttribute('data-show-numbers') === 'true';
          const collapsible = el.getAttribute('data-collapsible') === 'true';
          const headingTypesRaw = el.getAttribute('data-heading-types');
          const headingTypes = headingTypesRaw
            ? headingTypesRaw.split(',')
            : [...DEFAULT_HEADING_TYPES];

          return {
            id: generateId(),
            type: 'table-of-contents',
            props: {
              nodeType: 'void',
              depth: Math.min(3, Math.max(1, depth)) as 1 | 2 | 3,
              title,
              headingTypes,
              showNumbers,
              collapsible,
            },
            children: [{ text: '' }],
          };
        },
      },
      serialize: (element) => {
        const props = (element.props || defaultTocProps) as TableOfContentsElementProps;
        const {
          depth = 3,
          title = '',
          headingTypes = DEFAULT_HEADING_TYPES,
          showNumbers = false,
          collapsible = false,
        } = props;

        const attrs = [
          'data-type="table-of-contents"',
          `data-depth="${depth}"`,
          `data-title="${(title || '').replace(/"/g, '&quot;')}"`,
          `data-show-numbers="${showNumbers}"`,
          `data-collapsible="${collapsible}"`,
          `data-heading-types="${headingTypes.join(',')}"`,
        ].join(' ');

        return `<nav class="yoopta-table-of-contents" ${attrs} role="navigation" aria-label="${(title || 'Table of contents').replace(/"/g, '&quot;')}"></nav>`;
      },
    },
    markdown: {
      serialize: () => '[TOC]\n',
    },
    email: {
      serialize: (element) => {
        const props = (element.props ?? defaultTocProps) as TableOfContentsElementProps;
        const title = props.title ?? 'Table of Contents';
        return `<p style="font-weight: 600;">${title}</p><p>(Table of contents – view in browser for links)</p>`;
      },
    },
  },
  commands: TableOfContentsCommands,
});

export { TableOfContents };
