import { Elements, YooptaPlugin, serializeTextNodes } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { NavigationCommands } from './navigation-commands';
import type {
  NavigationElementMap,
  NavigationProps,
  NavLogoProps,
  NavLinkProps,
  NavCtaProps,
} from './types';
import './navigation.css';

const navDefaultProps: NavigationProps = {
  layout: 'standard',
  position: 'sticky',
  backgroundColor: '#ffffff',
  transparent: false,
  borderBottom: true,
  paddingX: '24px',
  height: '64px',
};

const logoDefaultProps: NavLogoProps = {
  color: '#111827',
  fontSize: '1.25rem',
  fontWeight: '700',
};

const linkDefaultProps: NavLinkProps = {
  url: '#',
  color: '#4b5563',
};

const ctaDefaultProps: NavCtaProps = {
  url: '#',
  buttonColor: '#3b82f6',
  buttonTextColor: '#ffffff',
  borderRadius: '8px',
};

function NavigationRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || navDefaultProps) as NavigationProps;

  const style: React.CSSProperties = {
    backgroundColor: elementProps.transparent ? 'transparent' : elementProps.backgroundColor,
    paddingLeft: elementProps.paddingX,
    paddingRight: elementProps.paddingX,
    height: elementProps.height,
  };

  return (
    <nav
      {...attributes}
      className="yoo-cms-nav"
      data-layout={elementProps.layout}
      data-position={elementProps.position}
      data-border={elementProps.borderBottom ? 'true' : undefined}
      style={style}
    >
      {children}
    </nav>
  );
}

function NavLogoRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || logoDefaultProps) as NavLogoProps;

  return (
    <span
      {...attributes}
      className="yoo-cms-nav-logo"
      style={{
        color: elementProps.color,
        fontSize: elementProps.fontSize,
        fontWeight: elementProps.fontWeight,
      }}
    >
      {children}
    </span>
  );
}

function NavLinksRender(props: PluginElementRenderProps) {
  const { attributes, children } = props;

  return (
    <div {...attributes} className="yoo-cms-nav-links">
      {children}
    </div>
  );
}

function NavLinkRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || linkDefaultProps) as NavLinkProps;

  return (
    <a
      {...attributes}
      href={elementProps.url}
      className="yoo-cms-nav-link"
      style={{ color: elementProps.color }}
    >
      {children}
    </a>
  );
}

function NavCtaRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || ctaDefaultProps) as NavCtaProps;

  return (
    <span
      {...attributes}
      className="yoo-cms-nav-cta"
      style={{
        backgroundColor: elementProps.buttonColor,
        color: elementProps.buttonTextColor,
        borderRadius: elementProps.borderRadius,
      }}
    >
      {children}
    </span>
  );
}

const NavigationPlugin = new YooptaPlugin<NavigationElementMap>({
  type: 'Navigation',
  elements: (
    <navigation
      props={navDefaultProps}
      render={(props) => <NavigationRender {...props} />}
    >
      <nav-logo
        props={logoDefaultProps}
        render={(props) => <NavLogoRender {...props} />}
        placeholder="Brand"
      />
      <nav-links
        render={(props) => <NavLinksRender {...props} />}
      >
        <nav-link
          props={linkDefaultProps}
          render={(props) => <NavLinkRender {...props} />}
          placeholder="Link"
        />
      </nav-links>
      <nav-cta
        props={ctaDefaultProps}
        render={(props) => <NavCtaRender {...props} />}
        placeholder="CTA"
      />
    </navigation>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const logo = editor.y('nav-logo', {
        props: logoDefaultProps,
        children: [editor.y.text('YourBrand')],
      });
      const links = editor.y('nav-links', {
        children: [
          editor.y('nav-link', { props: { url: '#features', color: '#4b5563' }, children: [editor.y.text('Features')] }),
          editor.y('nav-link', { props: { url: '#pricing', color: '#4b5563' }, children: [editor.y.text('Pricing')] }),
          editor.y('nav-link', { props: { url: '#about', color: '#4b5563' }, children: [editor.y.text('About')] }),
          editor.y('nav-link', { props: { url: '#docs', color: '#4b5563' }, children: [editor.y.text('Docs')] }),
        ],
      });
      const cta = editor.y('nav-cta', {
        props: ctaDefaultProps,
        children: [editor.y.text('Get Started')],
      });

      return editor.y('navigation', {
        props: navDefaultProps,
        children: [logo, links, cta],
      });
    },
  },
  commands: NavigationCommands,
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        // All nav elements are single-line
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

          // If logo is empty, delete the whole nav
          if (currentElement.type === 'nav-logo' && isEmpty) {
            event.preventDefault();
            editor.deleteBlock({ blockId: currentBlock.id });
            return;
          }

          // Prevent deleting other structural elements when empty
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
      title: 'Navigation',
      description: 'A navigation bar with logo, links, and CTA button',
    },
    shortcuts: ['nav', 'navigation'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['NAV'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'navigation') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'navigation') {
          const props = element.props as NavigationProps;
          const logoEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'nav-logo',
          );
          const linksEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'nav-links',
          );
          const ctaEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'nav-cta',
          );

          const logoProps = (logoEl as any)?.props as NavLogoProps | undefined;
          const ctaProps = (ctaEl as any)?.props as NavCtaProps | undefined;

          const logoHtml = logoEl ? serializeTextNodes(logoEl.children) : '';
          const ctaHtml = ctaEl ? serializeTextNodes(ctaEl.children) : '';

          const linksHtml = linksEl?.children
            ?.filter((c: any) => Element.isElement(c) && c.type === 'nav-link')
            .map((link: any) => {
              const linkProps = link.props as NavLinkProps;
              return `<a href="${linkProps?.url || '#'}" style="font-size:0.9375rem;font-weight:500;text-decoration:none;padding:6px 12px;color:${linkProps?.color || '#4b5563'};">${serializeTextNodes(link.children)}</a>`;
            })
            .join('') || '';

          const bgStyle = props?.transparent
            ? 'background:transparent;'
            : `background-color:${props?.backgroundColor || '#fff'};`;

          return `<nav data-type="navigation" data-meta-depth="${depth}" style="display:flex;align-items:center;justify-content:space-between;${bgStyle}padding:0 ${props?.paddingX || '24px'};height:${props?.height || '64px'};${props?.borderBottom ? 'border-bottom:1px solid rgba(0,0,0,0.1);' : ''}">
            <span style="font-weight:${logoProps?.fontWeight || '700'};font-size:${logoProps?.fontSize || '1.25rem'};color:${logoProps?.color || '#111827'};">${logoHtml}</span>
            <div style="display:flex;align-items:center;gap:8px;">${linksHtml}</div>
            <a href="${ctaProps?.url || '#'}" style="display:inline-flex;align-items:center;padding:8px 20px;font-size:0.875rem;font-weight:600;text-decoration:none;border-radius:${ctaProps?.borderRadius || '8px'};background:${ctaProps?.buttonColor || '#3b82f6'};color:${ctaProps?.buttonTextColor || '#fff'};">${ctaHtml}</a>
          </nav>`;
        }

        return '';
      },
    },
  },
});

export { NavigationPlugin };
