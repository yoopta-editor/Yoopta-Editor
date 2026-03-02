import { Elements } from '@yoopta/editor';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  LogoCloudProps,
  LogoCloudColumns,
  LogoCloudPaddingY,
  LogoCloudHeadingProps,
  LogoCloudDescriptionProps,
  LogoItemProps,
} from './types';

const COLUMNS_OPTIONS: { value: string; label: string }[] = [
  { value: '3', label: '3 Columns' },
  { value: '4', label: '4 Columns' },
  { value: '5', label: '5 Columns' },
  { value: '6', label: '6 Columns' },
];

const PADDING_OPTIONS: { value: LogoCloudPaddingY; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

export function LogoCloudSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const cloudEl = Elements.getElement(editor, { blockId, type: 'logo-cloud' });
  const headingEl = Elements.getElement(editor, { blockId, type: 'logo-cloud-heading' });
  const descEl = Elements.getElement(editor, { blockId, type: 'logo-cloud-description' });
  const items = Elements.getElements(editor, { blockId, type: 'logo-item' });

  if (!cloudEl) return null;

  const cloudProps = (cloudEl.props ?? {}) as Partial<LogoCloudProps>;
  const headingProps = (headingEl?.props ?? {}) as Partial<LogoCloudHeadingProps>;
  const descProps = (descEl?.props ?? {}) as Partial<LogoCloudDescriptionProps>;

  const updateCloud = (props: Partial<LogoCloudProps>) => {
    Elements.updateElement(editor, { blockId, type: 'logo-cloud', props });
  };

  const updateHeading = (props: Partial<LogoCloudHeadingProps>) => {
    Elements.updateElement(editor, { blockId, type: 'logo-cloud-heading', props });
  };

  const updateDescription = (props: Partial<LogoCloudDescriptionProps>) => {
    Elements.updateElement(editor, { blockId, type: 'logo-cloud-description', props });
  };

  const updateItem = (itemEl: any, props: Partial<LogoItemProps>) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'logo-item',
      props,
      match: (el) => el.id === itemEl.id,
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
            value={String(cloudProps.columns ?? 5)}
            onChange={(e) => updateCloud({ columns: Number(e.target.value) as LogoCloudColumns })}
          >
            {COLUMNS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Padding</label>
          <select
            className="yoo-cms-sidebar-select"
            value={cloudProps.paddingY ?? 'lg'}
            onChange={(e) => updateCloud({ paddingY: e.target.value as LogoCloudPaddingY })}
          >
            {PADDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Appearance */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Appearance</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Background Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={cloudProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateCloud({ backgroundColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={cloudProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateCloud({ backgroundColor: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={cloudProps.grayscale ?? false}
              onChange={(e) => updateCloud({ grayscale: e.target.checked })}
            />
            Grayscale (muted)
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

      {/* Logo Items */}
      {items.length > 0 && (
        <div className="yoo-cms-sidebar-section">
          <div className="yoo-cms-sidebar-section-title">Logo Items</div>
          {items.map((item, idx) => {
            const iProps = (item.props ?? {}) as Partial<LogoItemProps>;
            return (
              <div key={item.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: idx < items.length - 1 ? '1px solid #e5e7eb' : undefined }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Item {idx + 1}
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Text Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={iProps.color ?? '#374151'}
                      onChange={(e) => updateItem(item, { color: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={iProps.color ?? '#374151'}
                      onChange={(e) => updateItem(item, { color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Background</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={iProps.backgroundColor ?? '#f3f4f6'}
                      onChange={(e) => updateItem(item, { backgroundColor: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={iProps.backgroundColor ?? '#f3f4f6'}
                      onChange={(e) => updateItem(item, { backgroundColor: e.target.value })}
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
