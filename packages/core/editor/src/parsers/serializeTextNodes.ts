// [TODO] - Move to @yoopta/utils or @yoopta/editor/utils
// helpers for serializing text nodes when you use custom parsers in your plugins
export function serializeTextNodes(nodes: any[]): string {
  if (!nodes || !Array.isArray(nodes)) return '';

  return nodes
    .map((node) => {
      if ('text' in node) {
        let text = node.text;

        if (node.bold) {
          text = `<strong style="font-weight: bolder;">${text}</strong>`;
        }
        if (node.italic) {
          text = `<i>${text}</i>`;
        }
        if (node.strike) {
          text = `<s>${text}</s>`;
        }
        if (node.underline) {
          text = `<u>${text}</u>`;
        }
        if (node.code) {
          text = `<code style="background-color: rgb(242 242 242); border-radius: .25rem; font-size: 75%; padding: 3px 6px;">${text}</code>`;
        }
        if (node.highlight) {
          text = `<mark style="color: ${node.highlight?.color}; background-color: ${
            node.highlight?.backgroundColor || 'transparent'
          };">${text}</mark>`;
        }

        return text;
      }

      if (node.type === 'link') {
        const { url, target, rel } = node.props;
        const children = serializeTextNodes(node.children);

        return `<a href="${url}" target="${target}" rel="${rel}" style="color: rgb(0 122 255);
                cursor: pointer;
                position: relative;
                text-decoration-line: underline;
                text-underline-offset: 4px;">${children}</a>`;
      }

      return '';
    })
    .join('');
}

// [TODO] - Move to @yoopta/utils or @yoopta/editor/utils
// helpers for serializing text nodes into markdown style when you use custom parsers in your plugins
export function serializeTextNodesIntoMarkdown(nodes: any[]): string {
  if (!nodes || !Array.isArray(nodes)) return '';

  return nodes
    .map((node) => {
      if ('text' in node) {
        let text = node.text;

        if (node.bold) {
          text = `**${text}**`;
        }
        if (node.italic) {
          text = `*${text}*`;
        }
        if (node.strike) {
          text = `~~${text}~~`;
        }
        if (node.underline) {
          text = `<u>${text}</u>`;
        }
        if (node.code) {
          text = `\`${text}\``;
        }

        return text;
      }

      if (node.type === 'link') {
        const { url, target, rel } = node.props;
        const children = serializeTextNodesIntoMarkdown(node.children);

        return `[${children}](${url})`;
      }

      return '';
    })
    .join('');
}
