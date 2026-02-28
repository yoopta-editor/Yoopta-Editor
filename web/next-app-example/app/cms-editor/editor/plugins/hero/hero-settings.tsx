import { useRef } from 'react';
import { Elements } from '@yoopta/editor';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  HeroProps,
  HeroBadgeProps,
  HeroTitleProps,
  HeroSubtitleProps,
  HeroButtonProps,
  HeroVariant,
  HeroBackgroundType,
  HeroBackgroundEffect,
  HeroPaddingY,
  HeroTitleFontSize,
  HeroSubtitleFontSize,
  HeroBadgeVariant,
  HeroButtonVariant,
  HeroButtonSize,
} from './types';

const VARIANT_OPTIONS: { value: HeroVariant; label: string }[] = [
  { value: 'centered', label: 'Centered' },
  { value: 'split', label: 'Split' },
  { value: 'fullwidth', label: 'Full Width' },
];

const BG_TYPE_OPTIONS: { value: HeroBackgroundType; label: string }[] = [
  { value: 'color', label: 'Solid Color' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'image', label: 'Image' },
];

const BG_EFFECT_OPTIONS: { value: HeroBackgroundEffect; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'glow', label: 'Glow Orbs' },
  { value: 'grid', label: 'Grid Pattern' },
];

const PADDING_OPTIONS: { value: HeroPaddingY; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const TITLE_FONT_OPTIONS: { value: HeroTitleFontSize; label: string }[] = [
  { value: '4xl', label: '4XL (2.25rem)' },
  { value: '5xl', label: '5XL (3rem)' },
  { value: '6xl', label: '6XL (3.75rem)' },
  { value: '7xl', label: '7XL (4.5rem)' },
];

const SUBTITLE_FONT_OPTIONS: { value: HeroSubtitleFontSize; label: string }[] = [
  { value: 'lg', label: 'Large (1.125rem)' },
  { value: 'xl', label: 'XL (1.25rem)' },
  { value: '2xl', label: '2XL (1.5rem)' },
];

const BADGE_VARIANT_OPTIONS: { value: HeroBadgeVariant; label: string }[] = [
  { value: 'pill', label: 'Pill' },
  { value: 'outlined', label: 'Outlined' },
  { value: 'subtle', label: 'Subtle' },
];

const BUTTON_VARIANT_OPTIONS: { value: HeroButtonVariant; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'outline', label: 'Outline' },
];

const BUTTON_SIZE_OPTIONS: { value: HeroButtonSize; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const GRADIENT_PRESETS = [
  { value: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', label: 'Ocean' },
  { value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', label: 'Midnight' },
  { value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Purple Haze' },
  { value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Pink Sunset' },
  { value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Sky Blue' },
];

const TEXT_GRADIENT_PRESETS = [
  { value: 'linear-gradient(135deg, #60a5fa, #a78bfa)', label: 'Blue → Violet' },
  { value: 'linear-gradient(135deg, #f97316, #ef4444)', label: 'Orange → Red' },
  { value: 'linear-gradient(135deg, #34d399, #3b82f6)', label: 'Green → Blue' },
  { value: 'linear-gradient(135deg, #f472b6, #8b5cf6)', label: 'Pink → Purple' },
  { value: 'linear-gradient(135deg, #fbbf24, #f97316)', label: 'Yellow → Orange' },
];

function BackgroundImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="yoo-cms-sidebar-field">
      <label className="yoo-cms-sidebar-label">Background Image</label>
      <div className="yoo-cms-sidebar-upload">
        {value ? (
          <div className="yoo-cms-sidebar-upload-preview">
            <img src={value} alt="Background preview" />
            <button
              className="yoo-cms-sidebar-upload-remove"
              onClick={() => onChange('')}
              title="Remove image"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            className="yoo-cms-sidebar-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload image
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {value && (
          <button
            className="yoo-cms-sidebar-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Replace image
          </button>
        )}
        <input
          className="yoo-cms-sidebar-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste URL..."
        />
      </div>
    </div>
  );
}

export function HeroSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const heroEl = Elements.getElement(editor, { blockId, type: 'hero' });
  const badgeEl = Elements.getElement(editor, { blockId, type: 'hero-badge' });
  const titleEl = Elements.getElement(editor, { blockId, type: 'hero-title' });
  const subtitleEl = Elements.getElement(editor, { blockId, type: 'hero-subtitle' });
  const buttons = Elements.getElements(editor, { blockId, type: 'hero-button' });

  if (!heroEl) return null;

  const heroProps = (heroEl.props ?? {}) as Partial<HeroProps>;
  const badgeProps = (badgeEl?.props ?? {}) as Partial<HeroBadgeProps>;
  const titleProps = (titleEl?.props ?? {}) as Partial<HeroTitleProps>;
  const subtitleProps = (subtitleEl?.props ?? {}) as Partial<HeroSubtitleProps>;

  const updateHero = (props: Partial<HeroProps>) => {
    Elements.updateElement(editor, { blockId, type: 'hero', props });
  };

  const updateBadge = (props: Partial<HeroBadgeProps>) => {
    Elements.updateElement(editor, { blockId, type: 'hero-badge', props });
  };

  const updateTitle = (props: Partial<HeroTitleProps>) => {
    Elements.updateElement(editor, { blockId, type: 'hero-title', props });
  };

  const updateSubtitle = (props: Partial<HeroSubtitleProps>) => {
    Elements.updateElement(editor, { blockId, type: 'hero-subtitle', props });
  };

  const updateButton = (buttonEl: any, props: Partial<HeroButtonProps>) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'hero-button',
      props,
      match: (el) => el.id === buttonEl.id,
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
            value={heroProps.variant ?? 'centered'}
            onChange={(e) => updateHero({ variant: e.target.value as HeroVariant })}
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
            value={heroProps.paddingY ?? 'xl'}
            onChange={(e) => updateHero({ paddingY: e.target.value as HeroPaddingY })}
          >
            {PADDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={heroProps.fullHeight ?? false}
              onChange={(e) => updateHero({ fullHeight: e.target.checked })}
            />
            Full viewport height
          </label>
        </div>
      </div>

      {/* Background */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Background</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Type</label>
          <select
            className="yoo-cms-sidebar-select"
            value={heroProps.backgroundType ?? 'gradient'}
            onChange={(e) => updateHero({ backgroundType: e.target.value as HeroBackgroundType })}
          >
            {BG_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {heroProps.backgroundType === 'color' && (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Color</label>
            <div className="yoo-cms-sidebar-color-row">
              <input
                type="color"
                className="yoo-cms-sidebar-color-swatch"
                value={heroProps.backgroundColor ?? '#0f172a'}
                onChange={(e) => updateHero({ backgroundColor: e.target.value })}
              />
              <input
                className="yoo-cms-sidebar-input"
                value={heroProps.backgroundColor ?? '#0f172a'}
                onChange={(e) => updateHero({ backgroundColor: e.target.value })}
              />
            </div>
          </div>
        )}

        {heroProps.backgroundType === 'gradient' && (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Gradient Preset</label>
            <select
              className="yoo-cms-sidebar-select"
              value={heroProps.gradient ?? GRADIENT_PRESETS[0].value}
              onChange={(e) => updateHero({ gradient: e.target.value })}
            >
              {GRADIENT_PRESETS.map((opt) => (
                <option key={opt.label} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {heroProps.backgroundType === 'image' && (
          <BackgroundImageUploader
            value={heroProps.backgroundImage ?? ''}
            onChange={(url) => updateHero({ backgroundImage: url })}
          />
        )}

        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Effect</label>
          <select
            className="yoo-cms-sidebar-select"
            value={heroProps.backgroundEffect ?? 'none'}
            onChange={(e) => updateHero({ backgroundEffect: e.target.value as HeroBackgroundEffect })}
          >
            {BG_EFFECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={heroProps.overlay ?? false}
              onChange={(e) => updateHero({ overlay: e.target.checked })}
            />
            Overlay
          </label>
        </div>

        {heroProps.overlay && (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">
              Overlay Opacity ({Math.round((heroProps.overlayOpacity ?? 0.5) * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={heroProps.overlayOpacity ?? 0.5}
              onChange={(e) => updateHero({ overlayOpacity: parseFloat(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
        )}
      </div>

      {/* Badge */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Badge</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Style</label>
          <select
            className="yoo-cms-sidebar-select"
            value={badgeProps.variant ?? 'pill'}
            onChange={(e) => updateBadge({ variant: e.target.value as HeroBadgeVariant })}
          >
            {BADGE_VARIANT_OPTIONS.map((opt) => (
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
              value={badgeProps.backgroundColor ?? '#1e3a5f'}
              onChange={(e) => updateBadge({ backgroundColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={badgeProps.backgroundColor ?? 'rgba(59, 130, 246, 0.1)'}
              onChange={(e) => updateBadge({ backgroundColor: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Text Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={badgeProps.textColor ?? '#93c5fd'}
              onChange={(e) => updateBadge({ textColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={badgeProps.textColor ?? '#93c5fd'}
              onChange={(e) => updateBadge({ textColor: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Border Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={badgeProps.borderColor ?? '#1e3a5f'}
              onChange={(e) => updateBadge({ borderColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={badgeProps.borderColor ?? 'rgba(59, 130, 246, 0.3)'}
              onChange={(e) => updateBadge({ borderColor: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Link URL</label>
          <input
            className="yoo-cms-sidebar-input"
            value={badgeProps.url ?? ''}
            onChange={(e) => updateBadge({ url: e.target.value })}
            placeholder="https://... (optional)"
          />
        </div>
      </div>

      {/* Title */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Title</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Font Size</label>
          <select
            className="yoo-cms-sidebar-select"
            value={titleProps.fontSize ?? '6xl'}
            onChange={(e) => updateTitle({ fontSize: e.target.value as HeroTitleFontSize })}
          >
            {TITLE_FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={titleProps.gradientText ?? false}
              onChange={(e) => updateTitle({ gradientText: e.target.checked })}
            />
            Gradient text
          </label>
        </div>
        {titleProps.gradientText ? (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Gradient</label>
            <select
              className="yoo-cms-sidebar-select"
              value={titleProps.textGradient ?? TEXT_GRADIENT_PRESETS[0].value}
              onChange={(e) => updateTitle({ textGradient: e.target.value })}
            >
              {TEXT_GRADIENT_PRESETS.map((opt) => (
                <option key={opt.label} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Color</label>
            <div className="yoo-cms-sidebar-color-row">
              <input
                type="color"
                className="yoo-cms-sidebar-color-swatch"
                value={titleProps.color ?? '#ffffff'}
                onChange={(e) => updateTitle({ color: e.target.value })}
              />
              <input
                className="yoo-cms-sidebar-input"
                value={titleProps.color ?? '#ffffff'}
                onChange={(e) => updateTitle({ color: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Subtitle */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Subtitle</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Font Size</label>
          <select
            className="yoo-cms-sidebar-select"
            value={subtitleProps.fontSize ?? 'xl'}
            onChange={(e) => updateSubtitle({ fontSize: e.target.value as HeroSubtitleFontSize })}
          >
            {SUBTITLE_FONT_OPTIONS.map((opt) => (
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
              value={subtitleProps.color ?? '#94a3b8'}
              onChange={(e) => updateSubtitle({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={subtitleProps.color ?? '#94a3b8'}
              onChange={(e) => updateSubtitle({ color: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      {buttons.length > 0 && (
        <div className="yoo-cms-sidebar-section">
          <div className="yoo-cms-sidebar-section-title">Buttons</div>
          {buttons.map((btn, idx) => {
            const btnProps = (btn.props ?? {}) as Partial<HeroButtonProps>;
            return (
              <div key={btn.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: idx < buttons.length - 1 ? '1px solid #e5e7eb' : undefined }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>
                  Button {idx + 1}
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Variant</label>
                  <select
                    className="yoo-cms-sidebar-select"
                    value={btnProps.variant ?? 'primary'}
                    onChange={(e) => updateButton(btn, { variant: e.target.value as HeroButtonVariant })}
                  >
                    {BUTTON_VARIANT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Size</label>
                  <select
                    className="yoo-cms-sidebar-select"
                    value={btnProps.size ?? 'lg'}
                    onChange={(e) => updateButton(btn, { size: e.target.value as HeroButtonSize })}
                  >
                    {BUTTON_SIZE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Button Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={btnProps.buttonColor ?? '#3b82f6'}
                      onChange={(e) => updateButton(btn, { buttonColor: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={btnProps.buttonColor ?? '#3b82f6'}
                      onChange={(e) => updateButton(btn, { buttonColor: e.target.value })}
                    />
                  </div>
                </div>
                {btnProps.variant !== 'outline' && (
                  <div className="yoo-cms-sidebar-field">
                    <label className="yoo-cms-sidebar-label">Text Color</label>
                    <div className="yoo-cms-sidebar-color-row">
                      <input
                        type="color"
                        className="yoo-cms-sidebar-color-swatch"
                        value={btnProps.buttonTextColor ?? '#ffffff'}
                        onChange={(e) => updateButton(btn, { buttonTextColor: e.target.value })}
                      />
                      <input
                        className="yoo-cms-sidebar-input"
                        value={btnProps.buttonTextColor ?? '#ffffff'}
                        onChange={(e) => updateButton(btn, { buttonTextColor: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">URL</label>
                  <input
                    className="yoo-cms-sidebar-input"
                    value={btnProps.url ?? '#'}
                    onChange={(e) => updateButton(btn, { url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
