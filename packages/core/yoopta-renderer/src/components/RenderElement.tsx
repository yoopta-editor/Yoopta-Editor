import { TextComponent } from './TextComponent';
import { isElement } from '../utils';

export const getChildren = (props) => {
  const { node, renderElement, plugins, renderLeaf } = props;
  const children: any[] = [];
  const isLeafBlock = isElement(node) && node.nodeType !== 'inline';

  for (let i = 0; i < node.children.length; i++) {
    const n = node.children[i];

    if (isElement(n)) {
      children.push(
        <RenderElement
          key={n.id}
          element={n}
          renderElement={renderElement}
          plugins={plugins}
          renderLeaf={renderLeaf}
        />,
      );
    } else {
      children.push(
        <TextComponent
          key={n.id || i}
          isLast={isLeafBlock && i === node.children.length - 1}
          parent={node}
          text={n}
          renderLeaf={renderLeaf}
        />,
      );
    }
  }

  return children;
};

const RenderElement = (props) => {
  const { element, renderElement, renderLeaf } = props;
  const isInline = element.nodeType === 'inline';

  const attributes = {
    'data-slate-node': 'element',
  };

  if (isInline) {
    attributes['data-slate-inline'] = true;
  }

  const children: React.ReactNode = getChildren({
    node: element,
    renderElement,
    renderLeaf,
  });

  return renderElement({ attributes, children, element });
};

export { RenderElement };
