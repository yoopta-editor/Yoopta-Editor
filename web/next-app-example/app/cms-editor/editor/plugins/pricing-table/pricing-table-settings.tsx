import { Elements, serializeTextNodes } from '@yoopta/editor';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  PricingTableProps,
  PricingColumns,
  PricingVariant,
  PricingPaddingY,
  PricingHeadingProps,
  PricingDescriptionProps,
  PricingTierProps,
  PricingTierFeatureProps,
  PricingTierButtonProps,
} from './types';

const COLUMNS_OPTIONS: { value: PricingColumns; label: string }[] = [
  { value: 2, label: '2 Tiers' },
  { value: 3, label: '3 Tiers' },
  { value: 4, label: '4 Tiers' },
];

const VARIANT_OPTIONS: { value: PricingVariant; label: string }[] = [
  { value: 'cards', label: 'Cards (shadow)' },
  { value: 'bordered', label: 'Bordered' },
  { value: 'flat', label: 'Flat' },
];

const PADDING_OPTIONS: { value: PricingPaddingY; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const RADIUS_OPTIONS = [
  { value: '4px', label: '4px' },
  { value: '8px', label: '8px' },
  { value: '12px', label: '12px' },
  { value: '9999px', label: 'Pill' },
];

export function PricingTableSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const tableEl = Elements.getElement(editor, { blockId, type: 'pricing-table' });
  const headingEl = Elements.getElement(editor, { blockId, type: 'pricing-heading' });
  const descEl = Elements.getElement(editor, { blockId, type: 'pricing-description' });
  const tiers = Elements.getElements(editor, { blockId, type: 'pricing-tier' });

  if (!tableEl) return null;

  const tableProps = (tableEl.props ?? {}) as Partial<PricingTableProps>;
  const headingProps = (headingEl?.props ?? {}) as Partial<PricingHeadingProps>;
  const descProps = (descEl?.props ?? {}) as Partial<PricingDescriptionProps>;

  const updateTable = (props: Partial<PricingTableProps>) => {
    Elements.updateElement(editor, { blockId, type: 'pricing-table', props });
  };

  const updateHeading = (props: Partial<PricingHeadingProps>) => {
    Elements.updateElement(editor, { blockId, type: 'pricing-heading', props });
  };

  const updateDescription = (props: Partial<PricingDescriptionProps>) => {
    Elements.updateElement(editor, { blockId, type: 'pricing-description', props });
  };

  const updateTier = (tierEl: any, props: Partial<PricingTierProps>) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'pricing-tier',
      props,
      match: (el) => el.id === tierEl.id,
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
            value={tableProps.columns ?? 3}
            onChange={(e) => updateTable({ columns: Number(e.target.value) as PricingColumns })}
          >
            {COLUMNS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Style</label>
          <select
            className="yoo-cms-sidebar-select"
            value={tableProps.variant ?? 'cards'}
            onChange={(e) => updateTable({ variant: e.target.value as PricingVariant })}
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
            value={tableProps.paddingY ?? 'lg'}
            onChange={(e) => updateTable({ paddingY: e.target.value as PricingPaddingY })}
          >
            {PADDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Background</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={tableProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateTable({ backgroundColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={tableProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateTable({ backgroundColor: e.target.value })}
            />
          </div>
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

      {/* Tiers */}
      {tiers.length > 0 && (
        <div className="yoo-cms-sidebar-section">
          <div className="yoo-cms-sidebar-section-title">Tiers</div>
          {tiers.map((tier, idx) => {
            const tp = (tier.props ?? {}) as Partial<PricingTierProps>;
            const nameEl = tier.children?.find((c: any) => c.type === 'pricing-tier-name');
            const tierName = nameEl ? serializeTextNodes(nameEl.children) : `Tier ${idx + 1}`;

            return (
              <div key={tier.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: idx < tiers.length - 1 ? '1px solid #e5e7eb' : undefined }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  {tierName}
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={tp.featured ?? false}
                      onChange={(e) => updateTier(tier, { featured: e.target.checked })}
                    />
                    Featured (highlighted)
                  </label>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Accent Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={tp.accentColor ?? '#3b82f6'}
                      onChange={(e) => updateTier(tier, { accentColor: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={tp.accentColor ?? '#3b82f6'}
                      onChange={(e) => updateTier(tier, { accentColor: e.target.value })}
                    />
                  </div>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Card Background</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={tp.backgroundColor ?? '#ffffff'}
                      onChange={(e) => updateTier(tier, { backgroundColor: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={tp.backgroundColor ?? '#ffffff'}
                      onChange={(e) => updateTier(tier, { backgroundColor: e.target.value })}
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
