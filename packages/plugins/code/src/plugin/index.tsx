import { YooptaPlugin, generateId } from '@yoopta/editor';

import { CodeCommands } from '../commands';
import type { CodeElementMap, CodePluginBlockOptions } from '../types';
import { CodeElementProps, CodePluginElements } from '../types';
import { CodeEditor } from '../ui/Code';

const ALIGNS_TO_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const Code = new YooptaPlugin<CodeElementMap, CodePluginBlockOptions>({
  type: 'Code',
  customEditor: CodeEditor,
  elements: {
    code: {
      render: (props) => <pre />,
      props: {
        nodeType: 'void',
        language: 'javascript',
        theme: 'VSCode',
      },
    },
  },
  options: {
    display: {
      title: 'Code',
      description: 'Write the best code ever!',
    },
    shortcuts: ['```', 'code', 'js'],
  },
  commands: CodeCommands,
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['PRE'],
        parse: (el) => {
          if (el.nodeName === 'PRE') {
            const code = el.querySelector('code');
            const textContent = code ? code.textContent : el.textContent;

            const language = el.getAttribute('data-language') || 'javascript';
            const theme = el.getAttribute('data-theme') || 'VSCode';

            return {
              children: [{ text: textContent || '' }],
              type: 'code',
              id: generateId(),
              props: {
                language,
                theme,
                nodeType: 'void',
              },
            };
          }
        },
      },
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'left';
        const escapedText = escapeHTML(text);

        return `<pre data-theme="${element.props.theme}" data-language="${
          element.props.language
        }" data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; display: flex; width: 100%; justify-content: ${justify}; background-color: #263238; color: #fff; padding: 20px 24px; white-space: pre-line;"><code>${escapedText}</code></pre>`.toString();
      },
    },
    markdown: {
      serialize: (element, text) =>
        `\`\`\`${element.props.language || 'javascript'}\n${text}\n\`\`\``,
    },
    email: {
      serialize: (element, text, blockMeta) => {
        const { align = 'left', depth = 0 } = blockMeta || {};
        const justify = ALIGNS_TO_JUSTIFY[align] || 'left';
        const escapedText = escapeHTML(text);

        const props = { ...element.props };

        return `
          <table style="width:100%;">
            <tbody style="width:100%;">
              <tr>
                <td>
                  <pre data-theme="${props.theme || 'VSCode'}" data-language="${
          props.language || 'javascript'
        }" data-meta-align="${align}" data-meta-depth="${depth}" style="margin-left: ${
          depth * 20
        }px; display: flex; width: auto; justify-content: ${justify}; background-color: #263238; color: #fff; padding: 20px 24px;"><code>${escapedText}</code></pre>
                </td>
              </tr>
            </tbody>
          </table>
        `.toString();
      },
    },
  },
});

function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export { Code };
