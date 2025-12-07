import {
  YooptaPlugin,
  deserializeTextNodes,
  generateId,
  serializeTextNodes,
  PluginElementRenderProps,
} from '@yoopta/editor';

import { LinkCommands } from '../commands/link-commands';
import type { LinkElementMap, LinkElementProps } from '../types';

const linkProps: LinkElementProps = {
  url: null,
  target: '_self',
  rel: 'noopener noreferrer',
  title: '',
};

const Link = new YooptaPlugin<LinkElementMap>({
  type: 'LinkPlugin',
  elements: (
    <link
      props={linkProps}
      render={(props: PluginElementRenderProps) => (
        <a
          {...props.attributes}
          href={props.element.props.url}
          target={props.element.props.target}
          rel={props.element.props.rel}
          title={props.element.props.title}
          nodeType="inline">
          {props.children}
        </a>
      )}
      nodeType="inline"
    />
  ),
  options: {
    display: {
      title: 'Link',
      description: 'Create link',
    },
  },
  commands: LinkCommands,
  parsers: {
    html: {
      serialize: (element, text) => {
        const { url, target, rel, title } = element.props;
        return `<a href="${url}" target="${target}" rel="${rel}">${serializeTextNodes(
          element.children,
        )}</a>`;
      },
      deserialize: {
        nodeNames: ['A'],
        parse: (el, editor) => {
          if (el.nodeName === 'A') {
            const href = el.getAttribute('href') || '';

            const defaultLinkProps = editor.plugins.LinkPlugin.elements.link
              .props as LinkElementProps;

            // [TODO] Add target
            const target = el.getAttribute('target') || defaultLinkProps.target;
            const rel = el.getAttribute('rel') || defaultLinkProps.rel;
            const title = el.textContent || '';
            const props: LinkElementProps = {
              url: href,
              target,
              rel,
              title,
              nodeType: 'inline',
            };

            return {
              id: generateId(),
              type: 'link',
              props,
              children: deserializeTextNodes(editor, el.childNodes),
            };
          }
        },
      },
    },
    email: {
      serialize: (element, text) => {
        const { url, target, rel, title } = element.props;
        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td>
                  <a href="${url}" target="${target}" rel="${rel}">${serializeTextNodes(
          element.children,
        )}</a>
                </td>
              </tr>
            </tbody>
          </table>
        `;
      },
    },
  },
});

export { Link };
