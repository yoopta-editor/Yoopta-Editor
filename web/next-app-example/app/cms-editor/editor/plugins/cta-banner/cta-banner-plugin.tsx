import { Elements, YooptaPlugin, serializeTextNodes } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { CTABannerCommands } from './cta-banner-commands';
import type {
  CTABannerElementMap,
  CTABannerProps,
  CTAHeadingProps,
  CTADescriptionProps,
  CTAButtonProps,
} from './types';
import './cta-banner.css';

const bannerDefaultProps: CTABannerProps = {
  variant: 'centered',
  backgroundType: 'gradient',
  backgroundColor: '#1e40af',
  gradient: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
  borderRadius: '0px',
  paddingY: 'lg',
  bordered: false,
  borderColor: '#e5e7eb',
};

const headingDefaultProps: CTAHeadingProps = {
  color: '#ffffff',
  fontSize: '3xl',
};

const descriptionDefaultProps: CTADescriptionProps = {
  color: '#e2e8f0',
};

const buttonDefaultProps: CTAButtonProps = {
  url: '#',
  variant: 'primary',
  buttonColor: '#ffffff',
  buttonTextColor: '#1e40af',
  borderRadius: '8px',
};

function CTABannerRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || bannerDefaultProps) as CTABannerProps;

  const backgroundStyle: React.CSSProperties = {};
  if (elementProps.backgroundType === 'gradient') {
    backgroundStyle.background = elementProps.gradient;
  } else {
    backgroundStyle.backgroundColor = elementProps.backgroundColor;
  }

  if (elementProps.borderRadius && elementProps.borderRadius !== '0px') {
    backgroundStyle.borderRadius = elementProps.borderRadius;
  }

  if (elementProps.bordered) {
    backgroundStyle.border = `1px solid ${elementProps.borderColor}`;
  }

  return (
    <div
      {...attributes}
      className="yoo-cms-cta-banner"
      data-variant={elementProps.variant}
      data-padding-y={elementProps.paddingY}
      style={backgroundStyle}
    >
      <div className="yoo-cms-cta-banner-content">{children}</div>
    </div>
  );
}

function CTAHeadingRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || headingDefaultProps) as CTAHeadingProps;

  return (
    <h2
      {...attributes}
      className="yoo-cms-cta-heading"
      data-font-size={elementProps.fontSize}
      style={{ color: elementProps.color }}
    >
      {children}
    </h2>
  );
}

function CTADescriptionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || descriptionDefaultProps) as CTADescriptionProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-cta-description"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function CTAButtonsRender(props: PluginElementRenderProps) {
  const { attributes, children } = props;

  return (
    <div {...attributes} className="yoo-cms-cta-buttons">
      {children}
    </div>
  );
}

function CTAButtonRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || buttonDefaultProps) as CTAButtonProps;

  const style: React.CSSProperties = {
    borderRadius: elementProps.borderRadius,
  };

  if (elementProps.variant === 'outline') {
    style.borderColor = elementProps.buttonColor;
    style.color = elementProps.buttonColor;
  } else {
    style.backgroundColor = elementProps.buttonColor;
    style.borderColor = elementProps.buttonColor;
    style.color = elementProps.buttonTextColor;
  }

  return (
    <span
      {...attributes}
      className="yoo-cms-cta-button"
      data-variant={elementProps.variant}
      style={style}
    >
      {children}
    </span>
  );
}

const CTABannerPlugin = new YooptaPlugin<CTABannerElementMap>({
  type: 'CTABanner',
  elements: (
    <cta-banner
      props={bannerDefaultProps}
      render={(props) => <CTABannerRender {...props} />}
    >
      <cta-heading
        props={headingDefaultProps}
        render={(props) => <CTAHeadingRender {...props} />}
        placeholder="Call to action heading..."
      />
      <cta-description
        props={descriptionDefaultProps}
        render={(props) => <CTADescriptionRender {...props} />}
        placeholder="Supporting description..."
      />
      <cta-buttons
        render={(props) => <CTAButtonsRender {...props} />}
      >
        <cta-button
          props={buttonDefaultProps}
          render={(props) => <CTAButtonRender {...props} />}
          placeholder="Button"
        />
      </cta-buttons>
    </cta-banner>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const heading = editor.y('cta-heading', {
        props: headingDefaultProps,
        children: [editor.y.text('Ready to get started?')],
      });
      const description = editor.y('cta-description', {
        props: descriptionDefaultProps,
        children: [editor.y.text('Join thousands of teams already using our platform to build better products.')],
      });
      const button1 = editor.y('cta-button', {
        props: { ...buttonDefaultProps, variant: 'primary' },
        children: [editor.y.text('Start Free Trial')],
      });
      const button2 = editor.y('cta-button', {
        props: { ...buttonDefaultProps, variant: 'outline' },
        children: [editor.y.text('Contact Sales')],
      });
      const buttons = editor.y('cta-buttons', { children: [button1, button2] });

      return editor.y('cta-banner', {
        props: bannerDefaultProps,
        children: [heading, description, buttons],
      });
    },
  },
  commands: CTABannerCommands,
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

          if (currentElement.type === 'cta-heading' && isEmpty) {
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
      title: 'CTA Banner',
      description: 'A call-to-action banner with heading, description, and buttons',
    },
    shortcuts: ['cta', 'banner'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SECTION'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'cta-banner') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'cta-banner') {
          const props = element.props as CTABannerProps;
          const headingEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'cta-heading',
          );
          const descEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'cta-description',
          );
          const buttonsEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'cta-buttons',
          );

          const headingProps = (headingEl as any)?.props as CTAHeadingProps | undefined;
          const descProps = (descEl as any)?.props as CTADescriptionProps | undefined;

          const headingHtml = headingEl ? serializeTextNodes(headingEl.children) : '';
          const descHtml = descEl ? serializeTextNodes(descEl.children) : '';

          const buttonsHtml = buttonsEl?.children
            ?.filter((c: any) => Element.isElement(c) && c.type === 'cta-button')
            .map((btn: any) => {
              const btnProps = btn.props as CTAButtonProps;
              const isOutline = btnProps?.variant === 'outline';
              return `<a href="${btnProps?.url || '#'}" style="display:inline-block;padding:10px 24px;border-radius:${btnProps?.borderRadius || '8px'};font-weight:600;text-decoration:none;${
                isOutline
                  ? `border:2px solid ${btnProps?.buttonColor || '#fff'};color:${btnProps?.buttonColor || '#fff'};background:transparent;`
                  : `background:${btnProps?.buttonColor || '#fff'};color:${btnProps?.buttonTextColor || '#1e40af'};`
              }">${serializeTextNodes(btn.children)}</a>`;
            })
            .join(' ') || '';

          const bgStyle = props?.backgroundType === 'gradient'
            ? `background:${props.gradient};`
            : `background-color:${props?.backgroundColor || '#1e40af'};`;

          const borderStyle = props?.bordered
            ? `border:1px solid ${props.borderColor || '#e5e7eb'};`
            : '';

          const radiusStyle = props?.borderRadius && props.borderRadius !== '0px'
            ? `border-radius:${props.borderRadius};`
            : '';

          const paddingMap = { sm: '32px', md: '48px', lg: '64px', xl: '80px' };
          const py = paddingMap[props?.paddingY || 'lg'];

          const isInline = props?.variant === 'inline';

          return `<section data-type="cta-banner" data-meta-depth="${depth}" style="${bgStyle}${borderStyle}${radiusStyle}padding:${py} 32px;${isInline ? 'display:flex;align-items:center;justify-content:space-between;' : 'text-align:center;'}">
            <div${isInline ? ' style="flex:1;"' : ''}>
              <h2 style="font-size:1.875rem;font-weight:700;color:${headingProps?.color || '#fff'};margin:0;">${headingHtml}</h2>
              <p style="font-size:1rem;color:${descProps?.color || '#e2e8f0'};margin:8px 0 0;">${descHtml}</p>
            </div>
            <div style="${isInline ? '' : 'margin-top:24px;'}display:flex;gap:12px;${isInline ? '' : 'justify-content:center;'}">${buttonsHtml}</div>
          </section>`;
        }

        return '';
      },
    },
  },
});

export { CTABannerPlugin };
