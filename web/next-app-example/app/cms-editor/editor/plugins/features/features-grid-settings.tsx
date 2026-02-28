import { Elements } from '@yoopta/editor';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  FeaturesGridProps,
  FeaturesGridColumns,
  FeaturesGridVariant,
  FeaturesGridPaddingY,
  FeaturesHeadingProps,
  FeaturesDescriptionProps,
  FeatureCardProps,
} from './types';

const COLUMNS_OPTIONS: { value: string; label: string }[] = [
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
  { value: '4', label: '4 Columns' },
];

const VARIANT_OPTIONS: { value: FeaturesGridVariant; label: string }[] = [
  { value: 'cards', label: 'Cards' },
  { value: 'bordered', label: 'Bordered' },
  { value: 'minimal', label: 'Minimal' },
];

const PADDING_OPTIONS: { value: FeaturesGridPaddingY; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const ICON_PRESETS = ['⚡', '🎨', '🔌', '🚀', '🔒', '📊', '💡', '🎯', '⭐', '🔥', '💎', '🌐'];

export function FeaturesGridSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const gridEl = Elements.getElement(editor, { blockId, type: 'features-grid' });
  const headingEl = Elements.getElement(editor, { blockId, type: 'features-heading' });
  const descEl = Elements.getElement(editor, { blockId, type: 'features-description' });
  const cards = Elements.getElements(editor, { blockId, type: 'feature-card' });

  if (!gridEl) return null;

  const gridProps = (gridEl.props ?? {}) as Partial<FeaturesGridProps>;
  const headingProps = (headingEl?.props ?? {}) as Partial<FeaturesHeadingProps>;
  const descProps = (descEl?.props ?? {}) as Partial<FeaturesDescriptionProps>;

  const updateGrid = (props: Partial<FeaturesGridProps>) => {
    Elements.updateElement(editor, { blockId, type: 'features-grid', props });
  };

  const updateHeading = (props: Partial<FeaturesHeadingProps>) => {
    Elements.updateElement(editor, { blockId, type: 'features-heading', props });
  };

  const updateDescription = (props: Partial<FeaturesDescriptionProps>) => {
    Elements.updateElement(editor, { blockId, type: 'features-description', props });
  };

  const updateCard = (cardEl: any, props: Partial<FeatureCardProps>) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'feature-card',
      props,
      match: (el) => el.id === cardEl.id,
    });
  };

  return (
    <>
      {/* Layout */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Layout</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Columns</label>
          <select
            className="yoo-cms-sidebar-select"
            value={String(gridProps.columns ?? 3)}
            onChange={(e) => updateGrid({ columns: Number(e.target.value) as FeaturesGridColumns })}
          >
            {COLUMNS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Variant</label>
          <select
            className="yoo-cms-sidebar-select"
            value={gridProps.variant ?? 'cards'}
            onChange={(e) => updateGrid({ variant: e.target.value as FeaturesGridVariant })}
          >
            {VARIANT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Padding</label>
          <select
            className="yoo-cms-sidebar-select"
            value={gridProps.paddingY ?? 'lg'}
            onChange={(e) => updateGrid({ paddingY: e.target.value as FeaturesGridPaddingY })}
          >
            {PADDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Background */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Background</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={gridProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateGrid({ backgroundColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={gridProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateGrid({ backgroundColor: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={gridProps.showIcons ?? true}
              onChange={(e) => updateGrid({ showIcons: e.target.checked })}
            />
            Show Icons
          </label>
        </div>
      </div>

      {/* Heading */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Heading</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={headingProps.color ?? '#111827'}
              onChange={(e) => updateHeading({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={headingProps.color ?? '#111827'}
              onChange={(e) => updateHeading({ color: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Description</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={descProps.color ?? '#6b7280'}
              onChange={(e) => updateDescription({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={descProps.color ?? '#6b7280'}
              onChange={(e) => updateDescription({ color: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      {cards.length > 0 && gridProps.showIcons && (
        <div className="yoo-cms-sidebar-section">
          <div className="yoo-cms-sidebar-section-title">Card Icons</div>
          {cards.map((card, idx) => {
            const cardProps = (card.props ?? {}) as Partial<FeatureCardProps>;
            return (
              <div key={card.id} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Card {idx + 1}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                  {ICON_PRESETS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => updateCard(card, { icon })}
                      style={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: cardProps.icon === icon ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        borderRadius: 6,
                        background: cardProps.icon === icon ? '#eff6ff' : '#fff',
                        cursor: 'pointer',
                        fontSize: 16,
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Icon Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={cardProps.iconColor ?? '#3b82f6'}
                      onChange={(e) => updateCard(card, { iconColor: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={cardProps.iconColor ?? '#3b82f6'}
                      onChange={(e) => updateCard(card, { iconColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
