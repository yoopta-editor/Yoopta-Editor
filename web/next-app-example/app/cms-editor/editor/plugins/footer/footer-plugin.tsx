import { Elements, YooptaPlugin, serializeTextNodes } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { FooterCommands } from './footer-commands';
import type {
  FooterElementMap,
  FooterProps,
  FooterBrandProps,
  FooterDescriptionProps,
  FooterColumnTitleProps,
  FooterLinkProps,
  FooterCopyrightProps,
} from './types';
import './footer.css';

const footerDefaultProps: FooterProps = {
  layout: 'simple',
  backgroundColor: '#ffffff',
  paddingY: 'lg',
  borderTop: true,
  borderColor: '#e5e7eb',
};

const brandDefaultProps: FooterBrandProps = {
  color: '#111827',
  fontSize: '1.25rem',
};

const descriptionDefaultProps: FooterDescriptionProps = {
  color: '#6b7280',
};

const columnTitleDefaultProps: FooterColumnTitleProps = {
  color: '#111827',
};

const linkDefaultProps: FooterLinkProps = {
  url: '#',
  color: '#6b7280',
};

const copyrightDefaultProps: FooterCopyrightProps = {
  color: '#9ca3af',
};

function FooterRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || footerDefaultProps) as FooterProps;

  const style: React.CSSProperties = {
    backgroundColor: elementProps.backgroundColor,
  };

  if (elementProps.borderTop) {
    style.borderTopColor = elementProps.borderColor;
  }

  return (
    <footer
      {...attributes}
      className="yoo-cms-footer"
      data-layout={elementProps.layout}
      data-padding-y={elementProps.paddingY}
      data-border-top={elementProps.borderTop ? 'true' : undefined}
      style={style}
    >
      <div className="yoo-cms-footer-content">
        {children}
      </div>
    </footer>
  );
}

function FooterBrandRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || brandDefaultProps) as FooterBrandProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-footer-brand"
      style={{ color: elementProps.color, fontSize: elementProps.fontSize }}
    >
      {children}
    </p>
  );
}

function FooterDescriptionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || descriptionDefaultProps) as FooterDescriptionProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-footer-description"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function FooterColumnRender(props: PluginElementRenderProps) {
  const { attributes, children } = props;

  return (
    <div {...attributes} className="yoo-cms-footer-column">
      {children}
    </div>
  );
}

function FooterColumnTitleRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || columnTitleDefaultProps) as FooterColumnTitleProps;

  return (
    <h4
      {...attributes}
      className="yoo-cms-footer-column-title"
      style={{ color: elementProps.color }}
    >
      {children}
    </h4>
  );
}

function FooterLinkRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || linkDefaultProps) as FooterLinkProps;

  return (
    <span
      {...attributes}
      className="yoo-cms-footer-link"
      style={{ color: elementProps.color }}
    >
      {children}
    </span>
  );
}

function FooterCopyrightRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || copyrightDefaultProps) as FooterCopyrightProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-footer-copyright"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

const FooterPlugin = new YooptaPlugin<FooterElementMap>({
  type: 'Footer',
  elements: (
    <footer
      props={footerDefaultProps}
      render={(props) => <FooterRender {...props} />}
    >
      <footer-brand
        props={brandDefaultProps}
        render={(props) => <FooterBrandRender {...props} />}
        placeholder="Brand name"
      />
      <footer-description
        props={descriptionDefaultProps}
        render={(props) => <FooterDescriptionRender {...props} />}
        placeholder="Short description..."
      />
      <footer-column
        render={(props) => <FooterColumnRender {...props} />}
      >
        <footer-column-title
          props={columnTitleDefaultProps}
          render={(props) => <FooterColumnTitleRender {...props} />}
          placeholder="Column title"
        />
        <footer-link
          props={linkDefaultProps}
          render={(props) => <FooterLinkRender {...props} />}
          placeholder="Link text"
        />
      </footer-column>
      <footer-copyright
        props={copyrightDefaultProps}
        render={(props) => <FooterCopyrightRender {...props} />}
        placeholder="Copyright text..."
      />
    </footer>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const brand = editor.y('footer-brand', {
        props: brandDefaultProps,
        children: [editor.y.text('YourBrand')],
      });

      const description = editor.y('footer-description', {
        props: descriptionDefaultProps,
        children: [editor.y.text('Building the future of content editing. Simple, powerful, and extensible.')],
      });

      const columns = [
        {
          title: 'Product',
          links: [
            { text: 'Features', url: '#features' },
            { text: 'Pricing', url: '#pricing' },
            { text: 'Docs', url: '#docs' },
            { text: 'Changelog', url: '#changelog' },
          ],
        },
        {
          title: 'Company',
          links: [
            { text: 'About', url: '#about' },
            { text: 'Blog', url: '#blog' },
            { text: 'Careers', url: '#careers' },
            { text: 'Contact', url: '#contact' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { text: 'Privacy', url: '#privacy' },
            { text: 'Terms', url: '#terms' },
          ],
        },
      ].map((col) =>
        editor.y('footer-column', {
          children: [
            editor.y('footer-column-title', {
              props: columnTitleDefaultProps,
              children: [editor.y.text(col.title)],
            }),
            ...col.links.map((link) =>
              editor.y('footer-link', {
                props: { url: link.url, color: '#6b7280' },
                children: [editor.y.text(link.text)],
              }),
            ),
          ],
        }),
      );

      const copyright = editor.y('footer-copyright', {
        props: copyrightDefaultProps,
        children: [editor.y.text(`\u00A9 ${new Date().getFullYear()} YourBrand. All rights reserved.`)],
      });

      return editor.y('footer', {
        props: footerDefaultProps,
        children: [brand, description, ...columns, copyright],
      });
    },
  },
  commands: FooterCommands,
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

          if (currentElement.type === 'footer-brand' && isEmpty) {
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
      title: 'Footer',
      description: 'A website footer with brand, link columns, and copyright',
    },
    shortcuts: ['footer'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['FOOTER'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'footer') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'footer') {
          const props = element.props as FooterProps;
          const brandEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'footer-brand',
          );
          const descEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'footer-description',
          );
          const columns = element.children?.filter(
            (c: any) => Element.isElement(c) && c.type === 'footer-column',
          ) || [];
          const copyrightEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'footer-copyright',
          );

          const brandProps = (brandEl as any)?.props as FooterBrandProps | undefined;
          const descProps = (descEl as any)?.props as FooterDescriptionProps | undefined;
          const copyrightProps = (copyrightEl as any)?.props as FooterCopyrightProps | undefined;

          const brandHtml = brandEl ? serializeTextNodes(brandEl.children) : '';
          const descHtml = descEl ? serializeTextNodes(descEl.children) : '';
          const copyrightHtml = copyrightEl ? serializeTextNodes(copyrightEl.children) : '';

          const columnsHtml = columns.map((col: any) => {
            const titleEl = col.children?.find((c: any) => c.type === 'footer-column-title');
            const links = col.children?.filter((c: any) => c.type === 'footer-link') || [];
            const titleProps = (titleEl as any)?.props as FooterColumnTitleProps | undefined;
            const titleHtml = titleEl ? serializeTextNodes(titleEl.children) : '';

            const linksHtml = links.map((link: any) => {
              const lProps = link.props as FooterLinkProps;
              return `<a href="${lProps?.url || '#'}" style="font-size:0.875rem;text-decoration:none;color:${lProps?.color || '#6b7280'};display:block;line-height:2;">${serializeTextNodes(link.children)}</a>`;
            }).join('');

            return `<div style="min-width:120px;">
              <h4 style="font-size:0.8125rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:${titleProps?.color || '#111827'};margin:0 0 8px;">${titleHtml}</h4>
              ${linksHtml}
            </div>`;
          }).join('');

          const borderStyle = props?.borderTop
            ? `border-top:1px solid ${props.borderColor || '#e5e7eb'};`
            : '';

          const paddingMap = { sm: '32px', md: '48px', lg: '64px', xl: '80px' };
          const py = paddingMap[props?.paddingY || 'lg'];

          return `<footer data-type="footer" data-meta-depth="${depth}" style="background-color:${props?.backgroundColor || '#fff'};padding:${py} 0;${borderStyle}">
            <div style="max-width:1200px;margin:0 auto;padding:0 24px;display:flex;justify-content:space-between;align-items:flex-start;gap:48px;">
              <div style="flex:1;max-width:320px;">
                <p style="font-weight:700;font-size:${brandProps?.fontSize || '1.25rem'};color:${brandProps?.color || '#111827'};margin:0 0 8px;">${brandHtml}</p>
                <p style="font-size:0.875rem;color:${descProps?.color || '#6b7280'};margin:0;line-height:1.6;">${descHtml}</p>
              </div>
              <div style="display:flex;gap:48px;">${columnsHtml}</div>
            </div>
            <div style="max-width:1200px;margin:24px auto 0;padding:24px 24px 0;border-top:1px solid rgba(128,128,128,0.15);">
              <p style="font-size:0.8125rem;color:${copyrightProps?.color || '#9ca3af'};margin:0;">${copyrightHtml}</p>
            </div>
          </footer>`;
        }

        return '';
      },
    },
  },
});

export { FooterPlugin };
