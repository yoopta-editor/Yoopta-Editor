import { Elements } from '@yoopta/editor';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  CTABannerProps,
  CTABannerVariant,
  CTABannerPaddingY,
  CTAHeadingProps,
  CTADescriptionProps,
  CTAButtonProps,
  CTAButtonVariant,
} from './types';

const VARIANT_OPTIONS: { value: CTABannerVariant; label: string }[] = [
  { value: 'centered', label: 'Centered' },
  { value: 'inline', label: 'Inline (side by side)' },
  { value: 'stacked', label: 'Stacked' },
];

const PADDING_OPTIONS: { value: CTABannerPaddingY; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const HEADING_SIZE_OPTIONS = [
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: '4xl', label: '4XL' },
];

const RADIUS_OPTIONS = [
  { value: '0px', label: 'None' },
  { value: '8px', label: '8px' },
  { value: '12px', label: '12px' },
  { value: '16px', label: '16px' },
  { value: '24px', label: '24px' },
];

const BUTTON_VARIANT_OPTIONS: { value: CTAButtonVariant; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'outline', label: 'Outline' },
];

const GRADIENT_PRESETS = [
  { value: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)', label: 'Blue → Purple' },
  { value: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', label: 'Dark Navy' },
  { value: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', label: 'Green → Teal' },
  { value: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)', label: 'Red → Orange' },
  { value: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)', label: 'Purple → Pink' },
  { value: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', label: 'Sky → Indigo' },
];

export function CTABannerSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const bannerEl = Elements.getElement(editor, { blockId, type: 'cta-banner' });
  const headingEl = Elements.getElement(editor, { blockId, type: 'cta-heading' });
  const descEl = Elements.getElement(editor, { blockId, type: 'cta-description' });
  const buttons = Elements.getElements(editor, { blockId, type: 'cta-button' });

  if (!bannerEl) return null;

  const bannerProps = (bannerEl.props ?? {}) as Partial<CTABannerProps>;
  const headingProps = (headingEl?.props ?? {}) as Partial<CTAHeadingProps>;
  const descProps = (descEl?.props ?? {}) as Partial<CTADescriptionProps>;

  const updateBanner = (props: Partial<CTABannerProps>) => {
    Elements.updateElement(editor, { blockId, type: 'cta-banner', props });
  };

  const updateHeading = (props: Partial<CTAHeadingProps>) => {
    Elements.updateElement(editor, { blockId, type: 'cta-heading', props });
  };

  const updateDescription = (props: Partial<CTADescriptionProps>) => {
    Elements.updateElement(editor, { blockId, type: 'cta-description', props });
  };

  const updateButton = (btnEl: any, props: Partial<CTAButtonProps>) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'cta-button',
      props,
      match: (el) => el.id === btnEl.id,
    });
  };

  return (
    <>
      {/* Layout */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Layout</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Variant</label>
          <select
            className="yoo-cms-sidebar-select"
            value={bannerProps.variant ?? 'centered'}
            onChange={(e) => updateBanner({ variant: e.target.value as CTABannerVariant })}
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
            value={bannerProps.paddingY ?? 'lg'}
            onChange={(e) => updateBanner({ paddingY: e.target.value as CTABannerPaddingY })}
          >
            {PADDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Border Radius</label>
          <select
            className="yoo-cms-sidebar-select"
            value={bannerProps.borderRadius ?? '0px'}
            onChange={(e) => updateBanner({ borderRadius: e.target.value })}
          >
            {RADIUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Background */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Background</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Type</label>
          <select
            className="yoo-cms-sidebar-select"
            value={bannerProps.backgroundType ?? 'gradient'}
            onChange={(e) => updateBanner({ backgroundType: e.target.value as any })}
          >
            <option value="color">Solid Color</option>
            <option value="gradient">Gradient</option>
          </select>
        </div>
        {bannerProps.backgroundType === 'color' ? (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Color</label>
            <div className="yoo-cms-sidebar-color-row">
              <input
                type="color"
                className="yoo-cms-sidebar-color-swatch"
                value={bannerProps.backgroundColor ?? '#1e40af'}
                onChange={(e) => updateBanner({ backgroundColor: e.target.value })}
              />
              <input
                className="yoo-cms-sidebar-input"
                value={bannerProps.backgroundColor ?? '#1e40af'}
                onChange={(e) => updateBanner({ backgroundColor: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Gradient Preset</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  title={preset.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => updateBanner({ gradient: preset.value })}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: preset.value,
                    border: bannerProps.gradient === preset.value ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <input
              className="yoo-cms-sidebar-input"
              value={bannerProps.gradient ?? ''}
              onChange={(e) => updateBanner({ gradient: e.target.value })}
              placeholder="Custom CSS gradient..."
              style={{ marginTop: 6 }}
            />
          </div>
        )}
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={bannerProps.bordered ?? false}
              onChange={(e) => updateBanner({ bordered: e.target.checked })}
            />
            Border
          </label>
        </div>
        {bannerProps.bordered && (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Border Color</label>
            <div className="yoo-cms-sidebar-color-row">
              <input
                type="color"
                className="yoo-cms-sidebar-color-swatch"
                value={bannerProps.borderColor ?? '#e5e7eb'}
                onChange={(e) => updateBanner({ borderColor: e.target.value })}
              />
              <input
                className="yoo-cms-sidebar-input"
                value={bannerProps.borderColor ?? '#e5e7eb'}
                onChange={(e) => updateBanner({ borderColor: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Heading */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Heading</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Font Size</label>
          <select
            className="yoo-cms-sidebar-select"
            value={headingProps.fontSize ?? '3xl'}
            onChange={(e) => updateHeading({ fontSize: e.target.value as any })}
          >
            {HEADING_SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={headingProps.color ?? '#ffffff'}
              onChange={(e) => updateHeading({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={headingProps.color ?? '#ffffff'}
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
              value={descProps.color ?? '#e2e8f0'}
              onChange={(e) => updateDescription({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={descProps.color ?? '#e2e8f0'}
              onChange={(e) => updateDescription({ color: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      {buttons.length > 0 && (
        <div className="yoo-cms-sidebar-section">
          <div className="yoo-cms-sidebar-section-title">Buttons</div>
          {buttons.map((btn, idx) => {
            const bProps = (btn.props ?? {}) as Partial<CTAButtonProps>;
            return (
              <div key={btn.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: idx < buttons.length - 1 ? '1px solid #e5e7eb' : undefined }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Button {idx + 1}
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Variant</label>
                  <select
                    className="yoo-cms-sidebar-select"
                    value={bProps.variant ?? 'primary'}
                    onChange={(e) => updateButton(btn, { variant: e.target.value as CTAButtonVariant })}
                  >
                    {BUTTON_VARIANT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">URL</label>
                  <input
                    className="yoo-cms-sidebar-input"
                    value={bProps.url ?? '#'}
                    onChange={(e) => updateButton(btn, { url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Button Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={bProps.buttonColor ?? '#ffffff'}
                      onChange={(e) => updateButton(btn, { buttonColor: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={bProps.buttonColor ?? '#ffffff'}
                      onChange={(e) => updateButton(btn, { buttonColor: e.target.value })}
                    />
                  </div>
                </div>
                {bProps.variant !== 'outline' && (
                  <div className="yoo-cms-sidebar-field">
                    <label className="yoo-cms-sidebar-label">Text Color</label>
                    <div className="yoo-cms-sidebar-color-row">
                      <input
                        type="color"
                        className="yoo-cms-sidebar-color-swatch"
                        value={bProps.buttonTextColor ?? '#1e40af'}
                        onChange={(e) => updateButton(btn, { buttonTextColor: e.target.value })}
                      />
                      <input
                        className="yoo-cms-sidebar-input"
                        value={bProps.buttonTextColor ?? '#1e40af'}
                        onChange={(e) => updateButton(btn, { buttonTextColor: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Radius</label>
                  <select
                    className="yoo-cms-sidebar-select"
                    value={bProps.borderRadius ?? '8px'}
                    onChange={(e) => updateButton(btn, { borderRadius: e.target.value })}
                  >
                    {RADIUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
