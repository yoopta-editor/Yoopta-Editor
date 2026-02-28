import { Elements, YooptaPlugin, serializeTextNodes, useYooptaEditor } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { PricingTableCommands } from './pricing-table-commands';
import type {
  PricingTableElementMap,
  PricingTableProps,
  PricingHeadingProps,
  PricingDescriptionProps,
  PricingTierProps,
  PricingTierNameProps,
  PricingTierPriceProps,
  PricingTierPeriodProps,
  PricingTierFeatureProps,
  PricingTierButtonProps,
} from './types';
import './pricing-table.css';

const tableDefaultProps: PricingTableProps = {
  columns: 3,
  variant: 'cards',
  paddingY: 'lg',
  backgroundColor: '#ffffff',
};

const headingDefaultProps: PricingHeadingProps = { color: '#111827' };
const descriptionDefaultProps: PricingDescriptionProps = { color: '#6b7280' };

const tierDefaultProps: PricingTierProps = {
  featured: false,
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
};

const tierNameDefaultProps: PricingTierNameProps = { color: '#111827' };
const tierPriceDefaultProps: PricingTierPriceProps = { color: '#111827' };
const tierPeriodDefaultProps: PricingTierPeriodProps = { color: '#6b7280' };
const tierFeatureDefaultProps: PricingTierFeatureProps = { color: '#4b5563', included: true };

const tierButtonDefaultProps: PricingTierButtonProps = {
  url: '#',
  variant: 'primary',
  buttonColor: '#3b82f6',
  buttonTextColor: '#ffffff',
  borderRadius: '8px',
};

function PricingTableRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || tableDefaultProps) as PricingTableProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-pricing-table"
      data-columns={elementProps.columns}
      data-padding-y={elementProps.paddingY}
      style={{ backgroundColor: elementProps.backgroundColor }}
    >
      {children}
    </div>
  );
}

function PricingHeadingRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || headingDefaultProps) as PricingHeadingProps;

  return (
    <h2
      {...attributes}
      className="yoo-cms-pricing-heading"
      style={{ color: elementProps.color }}
    >
      {children}
    </h2>
  );
}

function PricingDescriptionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || descriptionDefaultProps) as PricingDescriptionProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-pricing-description"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function PricingTierRender(props: PluginElementRenderProps) {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const elementProps = (element.props || tierDefaultProps) as PricingTierProps;

  const block = blockId ? editor.children[blockId] : null;
  const gridEl = block?.value?.[0];
  const gridProps = (gridEl?.props || tableDefaultProps) as PricingTableProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-pricing-tier"
      data-variant={gridProps.variant}
      data-featured={elementProps.featured ? 'true' : undefined}
      style={{
        backgroundColor: elementProps.backgroundColor,
        borderColor: elementProps.featured ? elementProps.accentColor : undefined,
      }}
    >
      {elementProps.featured && (
        <div
          className="yoo-cms-pricing-tier-badge"
          contentEditable={false}
          style={{ backgroundColor: elementProps.accentColor }}
        >
          Most Popular
        </div>
      )}
      {children}
    </div>
  );
}

function PricingTierNameRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || tierNameDefaultProps) as PricingTierNameProps;

  return (
    <h3
      {...attributes}
      className="yoo-cms-pricing-tier-name"
      style={{ color: elementProps.color }}
    >
      {children}
    </h3>
  );
}

function PricingTierPriceRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || tierPriceDefaultProps) as PricingTierPriceProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-pricing-tier-price"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function PricingTierPeriodRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || tierPeriodDefaultProps) as PricingTierPeriodProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-pricing-tier-period"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function PricingTierFeatureRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || tierFeatureDefaultProps) as PricingTierFeatureProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-pricing-tier-feature"
      data-included={elementProps.included ? 'true' : 'false'}
    >
      <span className="yoo-cms-pricing-tier-feature-icon" contentEditable={false}>
        {elementProps.included ? '\u2713' : '\u2715'}
      </span>
      <span style={{ color: elementProps.color }}>{children}</span>
    </div>
  );
}

function PricingTierButtonRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || tierButtonDefaultProps) as PricingTierButtonProps;

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
    <a
      {...attributes}
      href={elementProps.url}
      className="yoo-cms-pricing-tier-button"
      data-variant={elementProps.variant}
      style={style}
    >
      {children}
    </a>
  );
}

const PricingTablePlugin = new YooptaPlugin<PricingTableElementMap>({
  type: 'PricingTable',
  elements: (
    <pricing-table
      props={tableDefaultProps}
      render={(props) => <PricingTableRender {...props} />}
    >
      <pricing-heading
        props={headingDefaultProps}
        render={(props) => <PricingHeadingRender {...props} />}
        placeholder="Pricing heading..."
      />
      <pricing-description
        props={descriptionDefaultProps}
        render={(props) => <PricingDescriptionRender {...props} />}
        placeholder="Pricing description..."
      />
      <pricing-tier
        props={tierDefaultProps}
        render={(props) => <PricingTierRender {...props} />}
      >
        <pricing-tier-name
          props={tierNameDefaultProps}
          render={(props) => <PricingTierNameRender {...props} />}
          placeholder="Tier name"
        />
        <pricing-tier-price
          props={tierPriceDefaultProps}
          render={(props) => <PricingTierPriceRender {...props} />}
          placeholder="$0"
        />
        <pricing-tier-period
          props={tierPeriodDefaultProps}
          render={(props) => <PricingTierPeriodRender {...props} />}
          placeholder="/month"
        />
        <pricing-tier-feature
          props={tierFeatureDefaultProps}
          render={(props) => <PricingTierFeatureRender {...props} />}
          placeholder="Feature..."
        />
        <pricing-tier-button
          props={tierButtonDefaultProps}
          render={(props) => <PricingTierButtonRender {...props} />}
          placeholder="Button text"
        />
      </pricing-tier>
    </pricing-table>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const tiers = [
        {
          name: 'Starter', price: '$9', period: '/month', featured: false, bg: '#ffffff',
          features: [
            { text: 'Up to 5 projects', included: true },
            { text: '1 GB storage', included: true },
            { text: 'Community support', included: true },
            { text: 'Analytics', included: false },
            { text: 'Custom domain', included: false },
          ],
          btnText: 'Get Started', btnVariant: 'outline' as const,
        },
        {
          name: 'Pro', price: '$29', period: '/month', featured: true, bg: '#f0f7ff',
          features: [
            { text: 'Unlimited projects', included: true },
            { text: '50 GB storage', included: true },
            { text: 'Priority support', included: true },
            { text: 'Advanced analytics', included: true },
            { text: 'Custom domain', included: true },
          ],
          btnText: 'Start Free Trial', btnVariant: 'primary' as const,
        },
        {
          name: 'Enterprise', price: '$99', period: '/month', featured: false, bg: '#ffffff',
          features: [
            { text: 'Unlimited everything', included: true },
            { text: '500 GB storage', included: true },
            { text: 'Dedicated support', included: true },
            { text: 'Custom analytics', included: true },
            { text: 'SSO & audit logs', included: true },
          ],
          btnText: 'Contact Sales', btnVariant: 'outline' as const,
        },
      ];

      const tierEls = tiers.map((t) =>
        editor.y('pricing-tier', {
          props: { featured: t.featured, accentColor: '#3b82f6', backgroundColor: t.bg },
          children: [
            editor.y('pricing-tier-name', { props: tierNameDefaultProps, children: [editor.y.text(t.name)] }),
            editor.y('pricing-tier-price', { props: tierPriceDefaultProps, children: [editor.y.text(t.price)] }),
            editor.y('pricing-tier-period', { props: tierPeriodDefaultProps, children: [editor.y.text(t.period)] }),
            ...t.features.map((f) =>
              editor.y('pricing-tier-feature', {
                props: { color: '#4b5563', included: f.included },
                children: [editor.y.text(f.text)],
              }),
            ),
            editor.y('pricing-tier-button', {
              props: {
                url: '#',
                variant: t.btnVariant,
                buttonColor: '#3b82f6',
                buttonTextColor: t.btnVariant === 'primary' ? '#ffffff' : '#3b82f6',
                borderRadius: '8px',
              },
              children: [editor.y.text(t.btnText)],
            }),
          ],
        }),
      );

      return editor.y('pricing-table', {
        props: tableDefaultProps,
        children: [
          editor.y('pricing-heading', { props: headingDefaultProps, children: [editor.y.text('Simple, transparent pricing')] }),
          editor.y('pricing-description', { props: descriptionDefaultProps, children: [editor.y.text('Choose the plan that works best for your team')] }),
          ...tierEls,
        ],
      });
    },
  },
  commands: PricingTableCommands,
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

          const currentElement = Elements.getElement(editor, { blockId: currentBlock.id });
          if (!currentElement) return;

          const isEmpty = Elements.isElementEmpty(editor, {
            blockId: currentBlock.id,
            type: currentElement.type,
          });

          if (currentElement.type === 'pricing-heading' && isEmpty) {
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
      title: 'Pricing Table',
      description: 'Pricing tiers with features, prices, and CTA buttons',
    },
    shortcuts: ['pricing', 'plans'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SECTION'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'pricing-table') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'pricing-table') {
          const props = element.props as PricingTableProps;
          const headingEl = element.children?.find((c: any) => Element.isElement(c) && c.type === 'pricing-heading');
          const descEl = element.children?.find((c: any) => Element.isElement(c) && c.type === 'pricing-description');
          const tiers = element.children?.filter((c: any) => Element.isElement(c) && c.type === 'pricing-tier') || [];

          const headingHtml = headingEl ? serializeTextNodes(headingEl.children) : '';
          const descHtml = descEl ? serializeTextNodes(descEl.children) : '';

          const tiersHtml = tiers.map((tier: any) => {
            const tp = tier.props as PricingTierProps;
            const nameEl = tier.children?.find((c: any) => c.type === 'pricing-tier-name');
            const priceEl = tier.children?.find((c: any) => c.type === 'pricing-tier-price');
            const periodEl = tier.children?.find((c: any) => c.type === 'pricing-tier-period');
            const features = tier.children?.filter((c: any) => c.type === 'pricing-tier-feature') || [];
            const btnEl = tier.children?.find((c: any) => c.type === 'pricing-tier-button');

            const nameHtml = nameEl ? serializeTextNodes(nameEl.children) : '';
            const priceHtml = priceEl ? serializeTextNodes(priceEl.children) : '';
            const periodHtml = periodEl ? serializeTextNodes(periodEl.children) : '';

            const featuresHtml = features.map((f: any) => {
              const fp = f.props as PricingTierFeatureProps;
              const icon = fp?.included ? '\u2713' : '\u2715';
              const iconColor = fp?.included ? '#22c55e' : '#d1d5db';
              return `<div style="display:flex;align-items:center;gap:8px;font-size:0.875rem;${fp?.included ? '' : 'opacity:0.5;text-decoration:line-through;'}color:${fp?.color || '#4b5563'};">
                <span style="color:${iconColor};">${icon}</span>${serializeTextNodes(f.children)}
              </div>`;
            }).join('');

            const btnProps = (btnEl as any)?.props as PricingTierButtonProps | undefined;
            const btnHtml = btnEl ? `<a href="${btnProps?.url || '#'}" style="display:block;text-align:center;padding:10px 24px;font-weight:600;font-size:0.9375rem;text-decoration:none;border-radius:${btnProps?.borderRadius || '8px'};${btnProps?.variant === 'outline'
              ? `border:2px solid ${btnProps?.buttonColor || '#3b82f6'};color:${btnProps?.buttonColor || '#3b82f6'};background:transparent;`
              : `background:${btnProps?.buttonColor || '#3b82f6'};color:${btnProps?.buttonTextColor || '#fff'};`
              }">${serializeTextNodes(btnEl.children)}</a>` : '';

            const badgeHtml = tp?.featured
              ? `<div style="position:absolute;top:-1px;left:50%;transform:translateX(-50%);padding:4px 16px;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#fff;background:${tp.accentColor || '#3b82f6'};border-radius:0 0 8px 8px;">Most Popular</div>`
              : '';

            return `<div style="position:relative;padding:32px 24px;border-radius:12px;background:${tp?.backgroundColor || '#fff'};${tp?.featured ? `box-shadow:0 4px 12px rgba(0,0,0,0.12);border:2px solid ${tp.accentColor || '#3b82f6'};` : 'box-shadow:0 1px 3px rgba(0,0,0,0.08);'}">
              ${badgeHtml}
              <h3 style="font-size:1.125rem;font-weight:600;margin:0 0 16px;color:${(nameEl as any)?.props?.color || '#111827'};">${nameHtml}</h3>
              <p style="font-size:2.5rem;font-weight:800;margin:0;color:${(priceEl as any)?.props?.color || '#111827'};">${priceHtml}</p>
              <p style="font-size:0.875rem;margin:4px 0 24px;color:${(periodEl as any)?.props?.color || '#6b7280'};">${periodHtml}</p>
              <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px;">${featuresHtml}</div>
              ${btnHtml}
            </div>`;
          }).join('');

          return `<section data-type="pricing-table" data-meta-depth="${depth}" style="padding:64px 24px;background-color:${props?.backgroundColor || '#fff'};">
            <h2 style="font-size:2rem;font-weight:700;text-align:center;margin:0 0 8px;color:${(headingEl as any)?.props?.color || '#111827'};">${headingHtml}</h2>
            <p style="font-size:1.125rem;text-align:center;color:${(descEl as any)?.props?.color || '#6b7280'};margin:0 auto 48px;max-width:600px;">${descHtml}</p>
            <div style="display:grid;grid-template-columns:repeat(${props?.columns || 3}, 1fr);gap:24px;align-items:start;">${tiersHtml}</div>
          </section>`;
        }

        return '';
      },
    },
  },
});

export { PricingTablePlugin };
