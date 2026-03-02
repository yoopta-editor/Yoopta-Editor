import { Elements, YooptaPlugin, serializeTextNodes } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { LogoCloudCommands } from './logo-cloud-commands';
import type {
  LogoCloudElementMap,
  LogoCloudProps,
  LogoCloudHeadingProps,
  LogoCloudDescriptionProps,
  LogoItemProps,
} from './types';
import './logo-cloud.css';

const cloudDefaultProps: LogoCloudProps = {
  columns: 5,
  paddingY: 'lg',
  backgroundColor: '#ffffff',
  grayscale: false,
};

const headingDefaultProps: LogoCloudHeadingProps = {
  color: '#111827',
};

const descriptionDefaultProps: LogoCloudDescriptionProps = {
  color: '#6b7280',
};

const itemDefaultProps: LogoItemProps = {
  color: '#374151',
  backgroundColor: '#f3f4f6',
};

function LogoCloudRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || cloudDefaultProps) as LogoCloudProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-logo-cloud"
      data-columns={elementProps.columns}
      data-padding-y={elementProps.paddingY}
      data-grayscale={elementProps.grayscale}
      style={{ backgroundColor: elementProps.backgroundColor }}
    >
      {children}
    </div>
  );
}

function LogoCloudHeadingRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || headingDefaultProps) as LogoCloudHeadingProps;

  return (
    <h2
      {...attributes}
      className="yoo-cms-logo-cloud-heading"
      style={{ color: elementProps.color }}
    >
      {children}
    </h2>
  );
}

function LogoCloudDescriptionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || descriptionDefaultProps) as LogoCloudDescriptionProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-logo-cloud-description"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function LogoItemRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || itemDefaultProps) as LogoItemProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-logo-item"
      style={{
        color: elementProps.color,
        backgroundColor: elementProps.backgroundColor,
      }}
    >
      {children}
    </div>
  );
}

const LogoCloudPlugin = new YooptaPlugin<LogoCloudElementMap>({
  type: 'LogoCloud',
  elements: (
    <logo-cloud
      props={cloudDefaultProps}
      render={(props) => <LogoCloudRender {...props} />}
    >
      <logo-cloud-heading
        props={headingDefaultProps}
        render={(props) => <LogoCloudHeadingRender {...props} />}
        placeholder="Section heading..."
      />
      <logo-cloud-description
        props={descriptionDefaultProps}
        render={(props) => <LogoCloudDescriptionRender {...props} />}
        placeholder="Section description..."
      />
      <logo-item
        props={itemDefaultProps}
        render={(props) => <LogoItemRender {...props} />}
        placeholder="Company name..."
      />
    </logo-cloud>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const items = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Wayne Enterprises'].map(
        (name) =>
          editor.y('logo-item', {
            props: itemDefaultProps,
            children: [editor.y.text(name)],
          }),
      );

      return editor.y('logo-cloud', {
        props: cloudDefaultProps,
        children: [
          editor.y('logo-cloud-heading', {
            props: headingDefaultProps,
            children: [editor.y.text('Trusted by innovative companies')],
          }),
          editor.y('logo-cloud-description', {
            props: descriptionDefaultProps,
            children: [editor.y.text('Join thousands of teams building with our platform')],
          }),
          ...items,
        ],
      });
    },
  },
  commands: LogoCloudCommands,
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        if (hotkeys.isEnter(event)) {
          if (event.isDefaultPrevented()) return;
          event.preventDefault();
          return;
        }

        if (hotkeys.isBackspace(event)) {
          if (event.isDefaultPrevented()) return;
          if (!slate.selection) return;

          const currentElement = Elements.getElement(editor, {
            blockId: currentBlock.id,
          });

          if (!currentElement) return;

          const isEmpty = Elements.isElementEmpty(editor, {
            blockId: currentBlock.id,
            type: currentElement.type,
          });

          if (currentElement.type === 'logo-cloud-heading' && isEmpty) {
            event.preventDefault();
            editor.deleteBlock({ blockId: currentBlock.id });
            return;
          }

          if (isEmpty) {
            event.preventDefault();
            return;
          }
        }
      };
    },
  },
  options: {
    display: {
      title: 'Logo Cloud',
      description: 'A grid of company logos with heading and description',
    },
    shortcuts: ['logo', 'logos', 'trusted'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SECTION'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'logo-cloud') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'logo-cloud') {
          const props = element.props as LogoCloudProps;
          const headingEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'logo-cloud-heading',
          );
          const descEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'logo-cloud-description',
          );
          const items = element.children?.filter(
            (c: any) => Element.isElement(c) && c.type === 'logo-item',
          ) || [];

          const headingProps = (headingEl as any)?.props as LogoCloudHeadingProps | undefined;
          const descProps = (descEl as any)?.props as LogoCloudDescriptionProps | undefined;

          const headingHtml = headingEl ? serializeTextNodes(headingEl.children) : '';
          const descHtml = descEl ? serializeTextNodes(descEl.children) : '';

          const itemsHtml = items
            .map((item: any) => {
              const itemProps = item.props as LogoItemProps;
              return `<div style="display:flex;align-items:center;justify-content:center;padding:16px 20px;border-radius:10px;font-weight:600;font-size:0.9375rem;color:${itemProps?.color || '#374151'};background-color:${itemProps?.backgroundColor || '#f3f4f6'};${props?.grayscale ? 'opacity:0.6;' : ''}">${serializeTextNodes(item.children)}</div>`;
            })
            .join('');

          const paddingMap = { sm: '32px', md: '48px', lg: '64px', xl: '96px' };
          const py = paddingMap[props?.paddingY || 'lg'];

          return `<section data-type="logo-cloud" data-meta-depth="${depth}" style="padding:${py} 24px;background-color:${props?.backgroundColor || '#fff'};">
            <h2 style="font-size:1.25rem;font-weight:600;text-align:center;margin:0 0 8px 0;color:${headingProps?.color || '#111827'};">${headingHtml}</h2>
            <p style="font-size:1rem;text-align:center;color:${descProps?.color || '#6b7280'};margin:0 auto 40px auto;max-width:500px;">${descHtml}</p>
            <div style="display:grid;grid-template-columns:repeat(${props?.columns || 5}, 1fr);gap:16px;">${itemsHtml}</div>
          </section>`;
        }

        return '';
      },
    },
  },
});

export { LogoCloudPlugin };
