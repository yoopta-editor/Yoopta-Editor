import {
  YooptaPlugin,
  deserializeTextNodes,
  generateId,
  serializeTextNodes,
  serializeTextNodesIntoMarkdown,
} from '@yoopta/editor';

import { CalloutCommands } from '../commands/callout-commands';
import { withCallout } from '../extensions/with-callout';
import type { CalloutElementMap, CalloutElementProps, CalloutTheme } from '../types';

const CALLOUT_THEME_STYLES: Record<CalloutTheme, { color: string; borderLeft: string; backgroundColor: string }> = {
  default: { color: '#374151', borderLeft: '4px solid #9ca3af', backgroundColor: '#f3f4f6' },
  info: { color: '#1e3a5f', borderLeft: '4px solid #3b82f6', backgroundColor: '#eff6ff' },
  success: { color: '#14532d', borderLeft: '4px solid #22c55e', backgroundColor: '#f0fdf4' },
  warning: { color: '#713f12', borderLeft: '4px solid #eab308', backgroundColor: '#fefce8' },
  error: { color: '#7f1d1d', borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2' },
};

const calloutProps: CalloutElementProps = {
  theme: 'default',
};

const Callout = new YooptaPlugin<CalloutElementMap>({
  type: 'Callout',
  elements: (
    <callout
      render={(props) => <div {...props.attributes}>{props.children}</div>}
      props={calloutProps}
    />
  ),
  commands: CalloutCommands,
  extensions: withCallout,
  options: {
    display: {
      title: 'Callout',
      description: 'Make writing stand out',
    },
    shortcuts: ['<'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['DL'],
        parse(el, editor) {
          if (el.nodeName === 'DL' || el.nodeName === 'DIV') {
            const theme = el.getAttribute('data-theme') as CalloutTheme;

            return {
              id: generateId(),
              type: 'callout',
              children: deserializeTextNodes(editor, el.childNodes),
              props: {
                theme,
              },
            };
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const themeName = (element.props?.theme as CalloutTheme) || 'default';
        const theme = CALLOUT_THEME_STYLES[themeName] || CALLOUT_THEME_STYLES.default;
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `<dl data-theme="${themeName}" data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; text-align: ${align}; padding: .5rem .5rem .5rem 1rem; margin-top: .5rem; border-radius: .375rem; color: ${
          theme.color
        }; border-left: ${theme.borderLeft}; background-color: ${
          theme.backgroundColor
        }">${serializeTextNodes(element.children)}</dl>`;
      },
    },
    markdown: {
      serialize: (element) => `> ${serializeTextNodesIntoMarkdown(element.children)}`,
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const themeName = (element.props?.theme as CalloutTheme) || 'default';
        const theme = CALLOUT_THEME_STYLES[themeName] || CALLOUT_THEME_STYLES.default;
        const { align = 'left', depth = 0 } = blockMeta || {};

        return `
        <table style="width: 100%; ">
          <tbody style="width: 100%;">
            <tr>
                <td data-theme="${themeName}" data-meta-align="${align}" data-meta-depth="${depth}" style="
    font-size: 16px;
    line-height: 1.75rem;
    margin-left: ${
      depth * 20
    }px; text-align: ${align}; padding: .5rem .5rem .5rem 1rem; margin-top: .5rem; border-radius: .375rem; color: ${
          theme.color
        }; border-left: ${theme.borderLeft}; background-color: ${
          theme.backgroundColor
        };">${serializeTextNodes(element.children)}
              </td>
            </tr>
        </tbody>
      </table>`;
      },
    },
  },
});

export { Callout };
