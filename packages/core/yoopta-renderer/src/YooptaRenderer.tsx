import { useMemo } from 'react';
import { Descendant } from 'slate';
import type { YooptaMark } from '@yoopta/editor';
import { getChildren } from './components/RenderElement';
import uniqWith from 'lodash.uniqwith';
import { useScrollToElement } from './utils';

type Props = {
  className?: string;
  data: Descendant[];
  plugins: any[];
  marks: YooptaMark[];
};

export function mergePlugins(plugins) {
  const items = plugins
    .map((instance) => {
      const { childPlugin, ...componentProps } = instance.getPlugin;
      return childPlugin
        ? [componentProps, { ...childPlugin.getPlugin, hasParent: true }]
        : componentProps;
    })
    .flat();

  const uniquePlugins = uniqWith(items, (a: any, b: any) => a.type === b.type);
  return uniquePlugins;
}

const ElementWrapper = ({ children, element, attributes, nodeType, render, HTMLAttributes }) => {
  const isInline = nodeType === 'inline';

  if (isInline) return render({ attributes, element, children });

  return (
    <div data-element-id={element.id} data-element-type={element.type} {...attributes}>
      {render({ attributes, element, children, HTMLAttributes })}
    </div>
  );
};

const TextLeaf = ({ attributes, children, placeholder, leaf }) => {
  return (
    <span {...attributes} data-placeholder={placeholder}>
      {children}
    </span>
  );
};

const YooptaRenderer = (props: Props) => {
  useScrollToElement();

  const { className, data, plugins, marks } = props;
  const yooptaPlugins: any[] = useMemo(() => mergePlugins(plugins), [plugins]);

  const renderElement = useMemo(() => {
    return (props) => {
      for (let i = 0; i < yooptaPlugins.length; i++) {
        const plugin = yooptaPlugins[i];
        const renderFn = plugin.renderer.render ? plugin.renderer.render : plugin.renderer(null);

        if (props.element.type === plugin.type) {
          return (
            <ElementWrapper
              key={props.element.id}
              element={props.element}
              attributes={props.attributes}
              nodeType={props.element.nodeType}
              render={renderFn}
              HTMLAttributes={plugin.options?.HTMLAttributes}>
              {props.children}
            </ElementWrapper>
          );
        }
      }

      return null;
    };
  }, [yooptaPlugins]);

  const renderLeaf = useMemo(() => {
    return (leafProps) => {
      const props = { ...leafProps };

      yooptaPlugins.forEach((plugin) => {
        if (plugin.leaf) {
          const leafChildren = plugin.leaf(null)(props);
          if (leafChildren) props.children = leafChildren;
        }
      });

      marks.forEach((mark) => {
        if (props.leaf[mark.type]) {
          props.children = mark.render(props);
        }
      });

      return <TextLeaf {...props} />;
    };
  }, [yooptaPlugins]);

  const renderProps = {
    node: { children: data },
    renderElement: renderElement,
    renderLeaf: renderLeaf,
  };

  return (
    <div id="yoopta-editor" className={className}>
      {getChildren(renderProps)}
    </div>
  );
};

export { YooptaRenderer };
