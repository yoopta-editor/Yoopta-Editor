import { Elements, YooptaPlugin, serializeTextNodes } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { HeroCommands } from './hero-commands';
import type {
  HeroElementMap,
  HeroProps,
  HeroBadgeProps,
  HeroTitleProps,
  HeroSubtitleProps,
  HeroButtonProps,
} from './types';
import './hero.css';

const heroDefaultProps: HeroProps = {
  variant: 'centered',
  backgroundType: 'gradient',
  backgroundColor: '#0f172a',
  gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
  backgroundImage: '',
  backgroundEffect: 'none',
  overlay: false,
  overlayOpacity: 0.5,
  paddingY: 'xl',
  fullHeight: false,
};

const heroBadgeDefaultProps: HeroBadgeProps = {
  variant: 'pill',
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  textColor: '#93c5fd',
  borderColor: 'rgba(59, 130, 246, 0.3)',
  url: '',
};

const heroTitleDefaultProps: HeroTitleProps = {
  fontSize: '6xl',
  color: '#ffffff',
  gradientText: false,
  textGradient: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
};

const heroSubtitleDefaultProps: HeroSubtitleProps = {
  fontSize: 'xl',
  color: '#94a3b8',
};

const heroButtonDefaultProps: HeroButtonProps = {
  url: '#',
  variant: 'primary',
  size: 'lg',
  buttonColor: '#3b82f6',
  buttonTextColor: '#ffffff',
};

function HeroRender(props: PluginElementRenderProps) {
  const { attributes, children, element, blockId } = props;
  const elementProps = (element.props || heroDefaultProps) as HeroProps;

  const backgroundStyle: React.CSSProperties = {};
  if (elementProps.backgroundType === 'color') {
    backgroundStyle.backgroundColor = elementProps.backgroundColor;
  } else if (elementProps.backgroundType === 'gradient') {
    backgroundStyle.background = elementProps.gradient;
  } else if (elementProps.backgroundType === 'image') {
    backgroundStyle.backgroundImage = `url(${elementProps.backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
  }

  const effect = elementProps.backgroundEffect ?? 'none';

  return (
    <div
      {...attributes}
      className="yoo-cms-hero"
      data-variant={elementProps.variant}
      data-padding-y={elementProps.paddingY}
      data-full-height={elementProps.fullHeight ? 'true' : undefined}
      style={backgroundStyle}
    >
      {/* Background effects layer */}
      {effect !== 'none' && (
        <div className="yoo-cms-hero-effects" contentEditable={false}>
          {effect === 'glow' && (
            <>
              <div className="yoo-cms-hero-glow-1" />
              <div className="yoo-cms-hero-glow-2" />
            </>
          )}
          {effect === 'grid' && <div className="yoo-cms-hero-grid-pattern" />}
        </div>
      )}

      {elementProps.overlay && (
        <div
          className="yoo-cms-hero-overlay"
          contentEditable={false}
          style={{ opacity: elementProps.overlayOpacity }}
        />
      )}

      <div className="yoo-cms-hero-content">{children}</div>
    </div>
  );
}

function HeroBadgeRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || heroBadgeDefaultProps) as HeroBadgeProps;

  return (
    <span
      {...attributes}
      className="yoo-cms-hero-badge"
      data-variant={elementProps.variant}
      style={{
        backgroundColor: elementProps.backgroundColor,
        color: elementProps.textColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: elementProps.borderColor,
      }}
    >
      {children}
    </span>
  );
}

function HeroTitleRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || heroTitleDefaultProps) as HeroTitleProps;

  const style: React.CSSProperties = { color: elementProps.color };
  if (elementProps.gradientText && elementProps.textGradient) {
    style.backgroundImage = elementProps.textGradient;
    style.color = undefined as any;
  }

  return (
    <h1
      {...attributes}
      className="yoo-cms-hero-title"
      data-font-size={elementProps.fontSize}
      data-gradient-text={elementProps.gradientText ? 'true' : undefined}
      style={style}
    >
      {children}
    </h1>
  );
}

function HeroSubtitleRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || heroSubtitleDefaultProps) as HeroSubtitleProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-hero-subtitle"
      data-font-size={elementProps.fontSize}
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function HeroButtonsRender(props: PluginElementRenderProps) {
  const { attributes, children } = props;

  return (
    <div {...attributes} className="yoo-cms-hero-buttons">
      {children}
    </div>
  );
}

function HeroButtonRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || heroButtonDefaultProps) as HeroButtonProps;

  const style: React.CSSProperties = {};
  if (elementProps.variant === 'outline') {
    style.borderColor = elementProps.buttonColor;
    style.color = elementProps.buttonColor;
  } else {
    style.backgroundColor = elementProps.buttonColor;
    style.borderColor = elementProps.buttonColor;
    style.color = elementProps.buttonTextColor;
  }

  return (
    <a
      href={elementProps.url}
      {...attributes}
      className="yoo-cms-hero-button"
      data-variant={elementProps.variant}
      data-size={elementProps.size}
      style={style}
    >
      {children}
    </a>
  );
}

const HeroPlugin = new YooptaPlugin<HeroElementMap>({
  type: 'Hero',
  elements: (
    <hero
      props={heroDefaultProps}
      render={(props) => <HeroRender {...props} />}
    >
      <hero-badge
        props={heroBadgeDefaultProps}
        render={(props) => <HeroBadgeRender {...props} />}
        placeholder="Badge text..."
      />
      <hero-title
        props={heroTitleDefaultProps}
        render={(props) => <HeroTitleRender {...props} />}
        placeholder="Hero title..."
      />
      <hero-subtitle
        props={heroSubtitleDefaultProps}
        render={(props) => <HeroSubtitleRender {...props} />}
        placeholder="Hero subtitle..."
      />
      <hero-buttons
        render={(props) => <HeroButtonsRender {...props} />}
      >
        <hero-button
          props={heroButtonDefaultProps}
          render={(props) => <HeroButtonRender {...props} />}
          placeholder="Button"
        />
      </hero-buttons>
    </hero>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const heroBadge = editor.y('hero-badge', {
        props: heroBadgeDefaultProps,
        children: [editor.y.text('Announcing v6.0')],
      });
      const heroTitle = editor.y('hero-title', {
        props: heroTitleDefaultProps,
        children: [editor.y.text('Hero section')],
      });
      const heroSubtitle = editor.y('hero-subtitle', {
        props: heroSubtitleDefaultProps,
        children: [editor.y.text('Create beautiful websites with the power of Yoopta CMS plugins. Direct editing meets component-based design.')],
      });
      const heroButton1 = editor.y('hero-button', {
        props: { ...heroButtonDefaultProps, variant: 'primary' },
        children: [editor.y.text('Get Started')],
      });
      const heroButton2 = editor.y('hero-button', {
        props: { ...heroButtonDefaultProps, variant: 'outline' },
        children: [editor.y.text('Learn More')],
      });
      const heroButtons = editor.y('hero-buttons', { children: [heroButton1, heroButton2] });

      return editor.y('hero', {
        props: heroDefaultProps,
        children: [heroBadge, heroTitle, heroSubtitle, heroButtons],
      });
    },
  },
  commands: HeroCommands,
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        if (hotkeys.isEnter(event)) {
          if (event.isDefaultPrevented()) return;

          const currentElement = Elements.getElement(editor, {
            blockId: currentBlock.id,
          });

          if (!currentElement) return;

          // All single-line elements: prevent enter
          if (
            currentElement.type === 'hero-badge' ||
            currentElement.type === 'hero-title' ||
            currentElement.type === 'hero-button'
          ) {
            event.preventDefault();
            return;
          }

          // In subtitle: prevent enter (keep single paragraph)
          if (currentElement.type === 'hero-subtitle') {
            event.preventDefault();
            return;
          }
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

          // If title is empty, delete the whole hero block
          if (currentElement.type === 'hero-title' && isEmpty) {
            event.preventDefault();
            editor.deleteBlock({ blockId: currentBlock.id });
            return;
          }

          // Prevent deleting structural elements when empty
          if (
            (currentElement.type === 'hero-badge' ||
              currentElement.type === 'hero-subtitle' ||
              currentElement.type === 'hero-buttons' ||
              currentElement.type === 'hero-button') &&
            isEmpty
          ) {
            event.preventDefault();
            return;
          }
        }
      };
    },
  },
  options: {
    display: {
      title: 'Hero Section',
      description: 'A hero banner with badge, title, subtitle, and CTA buttons',
    },
    shortcuts: ['hero'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SECTION'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'hero') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'hero') {
          const props = element.props as HeroProps;
          const badgeEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'hero-badge',
          );
          const titleEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'hero-title',
          );
          const subtitleEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'hero-subtitle',
          );
          const buttonsEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'hero-buttons',
          );

          const badgeProps = (badgeEl as any)?.props as HeroBadgeProps | undefined;
          const titleProps = (titleEl as any)?.props as HeroTitleProps | undefined;
          const subtitleProps = (subtitleEl as any)?.props as HeroSubtitleProps | undefined;

          const badgeHtml = badgeEl ? serializeTextNodes(badgeEl.children) : '';
          const titleHtml = titleEl ? serializeTextNodes(titleEl.children) : '';
          const subtitleHtml = subtitleEl ? serializeTextNodes(subtitleEl.children) : '';

          const buttonsHtml = buttonsEl?.children
            ?.filter((c: any) => Element.isElement(c) && c.type === 'hero-button')
            .map((btn: any) => {
              const btnProps = btn.props as HeroButtonProps;
              const btnColor = btnProps?.buttonColor || '#3b82f6';
              const btnTextColor = btnProps?.buttonTextColor || '#fff';
              const isOutline = btnProps?.variant === 'outline';

              return `<a href="${btnProps?.url || '#'}" style="display:inline-block;padding:14px 32px;border-radius:8px;font-weight:600;text-decoration:none;${isOutline
                ? `border:2px solid ${btnColor};color:${btnColor};background:transparent;`
                : `background:${btnColor};color:${btnTextColor};`
                }">${serializeTextNodes(btn.children)}</a>`;
            })
            .join(' ') || '';

          // Title styles
          let titleStyle = `font-size:3.75rem;font-weight:800;line-height:1.1;margin:0;`;
          if (titleProps?.gradientText && titleProps?.textGradient) {
            titleStyle += `background-image:${titleProps.textGradient};background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;`;
          } else {
            titleStyle += `color:${titleProps?.color || '#fff'};`;
          }

          // Badge HTML
          const badgeSection = badgeHtml
            ? `<div style="margin-bottom:24px;"><span style="display:inline-flex;align-items:center;padding:6px 16px;border-radius:9999px;font-size:0.875rem;font-weight:500;background:${badgeProps?.backgroundColor || 'rgba(59,130,246,0.1)'};color:${badgeProps?.textColor || '#93c5fd'};border:1px solid ${badgeProps?.borderColor || 'rgba(59,130,246,0.3)'};">${badgeHtml}</span></div>`
            : '';

          // Background effects (grid pattern as inline SVG would be too complex, skip for static HTML)
          const bgStyle = props?.backgroundType === 'gradient'
            ? `background:${props.gradient};`
            : props?.backgroundType === 'image'
              ? `background-image:url(${props.backgroundImage});background-size:cover;background-position:center;`
              : `background-color:${props?.backgroundColor || '#0f172a'};`;

          return `<section data-type="hero" data-meta-depth="${depth}" style="position:relative;padding:128px 48px;text-align:center;overflow:hidden;${bgStyle}${props?.fullHeight ? 'min-height:100vh;display:flex;align-items:center;justify-content:center;' : ''}">
            <div style="position:relative;z-index:1;max-width:800px;margin:0 auto;">
              ${badgeSection}
              <h1 style="${titleStyle}">${titleHtml}</h1>
              <p style="font-size:1.25rem;color:${subtitleProps?.color || '#94a3b8'};margin-top:24px;max-width:640px;margin-left:auto;margin-right:auto;">${subtitleHtml}</p>
              <div style="margin-top:40px;display:flex;gap:12px;justify-content:center;">${buttonsHtml}</div>
            </div>
          </section>`;
        }

        return '';
      },
    },
  },
});

export { HeroPlugin };
