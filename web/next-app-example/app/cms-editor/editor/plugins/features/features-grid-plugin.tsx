import { Elements, YooptaPlugin, serializeTextNodes, useYooptaEditor } from '@yoopta/editor';
import type { PluginElementRenderProps } from '@yoopta/editor';
import { Element } from 'slate';

import { FeaturesGridCommands } from './features-grid-commands';
import type {
  FeaturesGridElementMap,
  FeaturesGridProps,
  FeaturesHeadingProps,
  FeaturesDescriptionProps,
  FeatureCardProps,
  FeatureCardTitleProps,
  FeatureCardDescriptionProps,
} from './types';
import './features-grid.css';

const gridDefaultProps: FeaturesGridProps = {
  columns: 3,
  variant: 'cards',
  paddingY: 'lg',
  backgroundColor: '#ffffff',
  showIcons: true,
};

const headingDefaultProps: FeaturesHeadingProps = {
  color: '#111827',
};

const descriptionDefaultProps: FeaturesDescriptionProps = {
  color: '#6b7280',
};

const cardDefaultProps: FeatureCardProps = {
  icon: '⚡',
  iconColor: '#3b82f6',
};

const cardTitleDefaultProps: FeatureCardTitleProps = {
  color: '#111827',
};

const cardDescriptionDefaultProps: FeatureCardDescriptionProps = {
  color: '#6b7280',
};

function FeaturesGridRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || gridDefaultProps) as FeaturesGridProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-features-grid"
      data-columns={elementProps.columns}
      data-padding-y={elementProps.paddingY}
      style={{ backgroundColor: elementProps.backgroundColor }}
    >
      {children}
    </div>
  );
}

function FeaturesHeadingRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || headingDefaultProps) as FeaturesHeadingProps;

  return (
    <h2
      {...attributes}
      className="yoo-cms-features-heading"
      style={{ color: elementProps.color }}
    >
      {children}
    </h2>
  );
}

function FeaturesDescriptionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || descriptionDefaultProps) as FeaturesDescriptionProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-features-description"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

function FeatureCardRender(props: PluginElementRenderProps) {
  const { attributes, children, element, blockId } = props;
  const editor = useYooptaEditor();
  const elementProps = (element.props || cardDefaultProps) as FeatureCardProps;

  const block = blockId ? editor.children[blockId] : null;
  const gridEl = block?.value?.[0];
  const gridProps = (gridEl?.props || gridDefaultProps) as FeaturesGridProps;

  return (
    <div
      {...attributes}
      className="yoo-cms-feature-card"
      data-variant={gridProps.variant}
    >
      {gridProps.showIcons && (
        <div
          className="yoo-cms-feature-card-icon"
          contentEditable={false}
          style={{ color: elementProps.iconColor }}
        >
          {elementProps.icon}
        </div>
      )}
      {children}
    </div>
  );
}

function FeatureCardTitleRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || cardTitleDefaultProps) as FeatureCardTitleProps;

  return (
    <h3
      {...attributes}
      className="yoo-cms-feature-card-title"
      style={{ color: elementProps.color }}
    >
      {children}
    </h3>
  );
}

function FeatureCardDescriptionRender(props: PluginElementRenderProps) {
  const { attributes, children, element } = props;
  const elementProps = (element.props || cardDescriptionDefaultProps) as FeatureCardDescriptionProps;

  return (
    <p
      {...attributes}
      className="yoo-cms-feature-card-description"
      style={{ color: elementProps.color }}
    >
      {children}
    </p>
  );
}

const FeaturesGridPlugin = new YooptaPlugin<FeaturesGridElementMap>({
  type: 'FeaturesGrid',
  elements: (
    <features-grid
      props={gridDefaultProps}
      render={(props) => <FeaturesGridRender {...props} />}
    >
      <features-heading
        props={headingDefaultProps}
        render={(props) => <FeaturesHeadingRender {...props} />}
        placeholder="Section heading..."
      />
      <features-description
        props={descriptionDefaultProps}
        render={(props) => <FeaturesDescriptionRender {...props} />}
        placeholder="Section description..."
      />
      <feature-card
        props={cardDefaultProps}
        render={(props) => <FeatureCardRender {...props} />}
      >
        <feature-card-title
          props={cardTitleDefaultProps}
          render={(props) => <FeatureCardTitleRender {...props} />}
          placeholder="Feature title..."
        />
        <feature-card-description
          props={cardDescriptionDefaultProps}
          render={(props) => <FeatureCardDescriptionRender {...props} />}
          placeholder="Feature description..."
        />
      </feature-card>
    </features-grid>
  ),
  lifecycle: {
    beforeCreate: (editor) => {
      const cards = [
        { icon: '⚡', title: 'Lightning Fast', desc: 'Built for speed with optimized rendering and minimal bundle size.' },
        { icon: '🎨', title: 'Fully Customizable', desc: 'Every component can be styled and configured to match your brand.' },
        { icon: '🔌', title: 'Plugin System', desc: 'Extend functionality with a powerful and flexible plugin architecture.' },
      ].map((f) =>
        editor.y('feature-card', {
          props: { icon: f.icon, iconColor: '#3b82f6' },
          children: [
            editor.y('feature-card-title', {
              props: cardTitleDefaultProps,
              children: [editor.y.text(f.title)],
            }),
            editor.y('feature-card-description', {
              props: cardDescriptionDefaultProps,
              children: [editor.y.text(f.desc)],
            }),
          ],
        }),
      );

      return editor.y('features-grid', {
        props: gridDefaultProps,
        children: [
          editor.y('features-heading', {
            props: headingDefaultProps,
            children: [editor.y.text('Features')],
          }),
          editor.y('features-description', {
            props: descriptionDefaultProps,
            children: [editor.y.text('Everything you need to build modern websites')],
          }),
          ...cards,
        ],
      });
    },
  },
  commands: FeaturesGridCommands,
  events: {
    onKeyDown(editor, slate, { hotkeys, currentBlock }) {
      return (event) => {
        // Prevent Enter in all elements (single-line)
        if (hotkeys.isEnter(event)) {
          if (event.isDefaultPrevented()) return;

          const currentElement = Elements.getElement(editor, {
            blockId: currentBlock.id,
          });

          if (!currentElement) return;

          // All features elements are single-line
          event.preventDefault();
          return;
        }

        // Backspace: handle structural protection
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

          // If heading is empty, delete the whole block
          if (currentElement.type === 'features-heading' && isEmpty) {
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
      title: 'Features Grid',
      description: 'A grid of feature cards with icons and descriptions',
    },
    shortcuts: ['features'],
  },
  parsers: {
    html: {
      deserialize: {
        nodeNames: ['SECTION'],
        parse: (el) => {
          if (el.getAttribute('data-type') !== 'features-grid') return;
        },
      },
      serialize: (element, text, blockMeta) => {
        const { depth = 0 } = blockMeta ?? {};

        if (element.type === 'features-grid') {
          const props = element.props as FeaturesGridProps;
          const headingEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'features-heading',
          );
          const descEl = element.children?.find(
            (c: any) => Element.isElement(c) && c.type === 'features-description',
          );
          const cards = element.children?.filter(
            (c: any) => Element.isElement(c) && c.type === 'feature-card',
          ) || [];

          const headingHtml = headingEl ? serializeTextNodes(headingEl.children) : '';
          const descHtml = descEl ? serializeTextNodes(descEl.children) : '';

          const cardsHtml = cards.map((card: any) => {
            const cardProps = card.props as FeatureCardProps;
            const titleEl = card.children?.find((c: any) => c.type === 'feature-card-title');
            const cardDescEl = card.children?.find((c: any) => c.type === 'feature-card-description');
            const titleHtml = titleEl ? serializeTextNodes(titleEl.children) : '';
            const cardDescHtml = cardDescEl ? serializeTextNodes(cardDescEl.children) : '';

            return `<div style="padding:24px;border-radius:10px;background:#f9fafb;border:1px solid #f3f4f6;">
              ${props.showIcons ? `<div style="font-size:1.75rem;margin-bottom:16px;">${cardProps?.icon || '⚡'}</div>` : ''}
              <h3 style="font-size:1.125rem;font-weight:600;margin:0 0 8px 0;color:${(titleEl as any)?.props?.color || '#111827'};">${titleHtml}</h3>
              <p style="font-size:0.9375rem;color:${(cardDescEl as any)?.props?.color || '#6b7280'};margin:0;line-height:1.6;">${cardDescHtml}</p>
            </div>`;
          }).join('');

          return `<section data-type="features-grid" data-meta-depth="${depth}" style="padding:64px 24px;background-color:${props?.backgroundColor || '#fff'};">
            <h2 style="font-size:2rem;font-weight:700;text-align:center;margin:0 0 12px 0;color:${(headingEl as any)?.props?.color || '#111827'};">${headingHtml}</h2>
            <p style="font-size:1.125rem;text-align:center;color:${(descEl as any)?.props?.color || '#6b7280'};margin:0 auto 48px auto;max-width:600px;">${descHtml}</p>
            <div style="display:grid;grid-template-columns:repeat(${props?.columns || 3}, 1fr);gap:24px;">${cardsHtml}</div>
          </section>`;
        }

        return '';
      },
    },
  },
});

export { FeaturesGridPlugin };
