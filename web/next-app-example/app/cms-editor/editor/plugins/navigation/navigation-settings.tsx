import { Elements } from '@yoopta/editor';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  NavigationProps,
  NavLogoProps,
  NavLinkProps,
  NavCtaProps,
  NavLayout,
  NavPosition,
} from './types';

const LAYOUT_OPTIONS: { value: NavLayout; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'centered', label: 'Centered Links' },
  { value: 'minimal', label: 'Minimal (no links)' },
];

const POSITION_OPTIONS: { value: NavPosition; label: string }[] = [
  { value: 'sticky', label: 'Sticky' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'static', label: 'Static' },
];

const HEIGHT_OPTIONS = [
  { value: '48px', label: '48px — Compact' },
  { value: '56px', label: '56px — Small' },
  { value: '64px', label: '64px — Default' },
  { value: '72px', label: '72px — Tall' },
  { value: '80px', label: '80px — Extra tall' },
];

const RADIUS_OPTIONS = [
  { value: '4px', label: '4px' },
  { value: '6px', label: '6px' },
  { value: '8px', label: '8px' },
  { value: '9999px', label: 'Pill' },
];

export function NavigationSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const navEl = Elements.getElement(editor, { blockId, type: 'navigation' });
  const logoEl = Elements.getElement(editor, { blockId, type: 'nav-logo' });
  const ctaEl = Elements.getElement(editor, { blockId, type: 'nav-cta' });
  const links = Elements.getElements(editor, { blockId, type: 'nav-link' });

  if (!navEl) return null;

  const navProps = (navEl.props ?? {}) as Partial<NavigationProps>;
  const logoProps = (logoEl?.props ?? {}) as Partial<NavLogoProps>;
  const ctaProps = (ctaEl?.props ?? {}) as Partial<NavCtaProps>;

  const updateNav = (props: Partial<NavigationProps>) => {
    Elements.updateElement(editor, { blockId, type: 'navigation', props });
  };

  const updateLogo = (props: Partial<NavLogoProps>) => {
    Elements.updateElement(editor, { blockId, type: 'nav-logo', props });
  };

  const updateCta = (props: Partial<NavCtaProps>) => {
    Elements.updateElement(editor, { blockId, type: 'nav-cta', props });
  };

  const updateLink = (linkEl: any, props: Partial<NavLinkProps>) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'nav-link',
      props,
      match: (el) => el.id === linkEl.id,
    });
  };

  return (
    <>
      {/* Layout */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Layout</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Style</label>
          <select
            className="yoo-cms-sidebar-select"
            value={navProps.layout ?? 'standard'}
            onChange={(e) => updateNav({ layout: e.target.value as NavLayout })}
          >
            {LAYOUT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Position</label>
          <select
            className="yoo-cms-sidebar-select"
            value={navProps.position ?? 'sticky'}
            onChange={(e) => updateNav({ position: e.target.value as NavPosition })}
          >
            {POSITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Height</label>
          <select
            className="yoo-cms-sidebar-select"
            value={navProps.height ?? '64px'}
            onChange={(e) => updateNav({ height: e.target.value })}
          >
            {HEIGHT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Appearance */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Appearance</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={navProps.transparent ?? false}
              onChange={(e) => updateNav({ transparent: e.target.checked })}
            />
            Transparent background
          </label>
        </div>
        {!navProps.transparent && (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Background Color</label>
            <div className="yoo-cms-sidebar-color-row">
              <input
                type="color"
                className="yoo-cms-sidebar-color-swatch"
                value={navProps.backgroundColor ?? '#ffffff'}
                onChange={(e) => updateNav({ backgroundColor: e.target.value })}
              />
              <input
                className="yoo-cms-sidebar-input"
                value={navProps.backgroundColor ?? '#ffffff'}
                onChange={(e) => updateNav({ backgroundColor: e.target.value })}
              />
            </div>
          </div>
        )}
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={navProps.borderBottom ?? true}
              onChange={(e) => updateNav({ borderBottom: e.target.checked })}
            />
            Bottom border
          </label>
        </div>
      </div>

      {/* Logo */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Logo</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={logoProps.color ?? '#111827'}
              onChange={(e) => updateLogo({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={logoProps.color ?? '#111827'}
              onChange={(e) => updateLogo({ color: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Font Size</label>
          <input
            className="yoo-cms-sidebar-input"
            value={logoProps.fontSize ?? '1.25rem'}
            onChange={(e) => updateLogo({ fontSize: e.target.value })}
            placeholder="1.25rem"
          />
        </div>
      </div>

      {/* Links */}
      {links.length > 0 && (
        <div className="yoo-cms-sidebar-section">
          <div className="yoo-cms-sidebar-section-title">Links</div>
          {links.map((link, idx) => {
            const lProps = (link.props ?? {}) as Partial<NavLinkProps>;
            return (
              <div key={link.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: idx < links.length - 1 ? '1px solid #e5e7eb' : undefined }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  Link {idx + 1}
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">URL</label>
                  <input
                    className="yoo-cms-sidebar-input"
                    value={lProps.url ?? '#'}
                    onChange={(e) => updateLink(link, { url: e.target.value })}
                    placeholder="#section or https://..."
                  />
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={lProps.color ?? '#4b5563'}
                      onChange={(e) => updateLink(link, { color: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={lProps.color ?? '#4b5563'}
                      onChange={(e) => updateLink(link, { color: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA Button */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">CTA Button</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">URL</label>
          <input
            className="yoo-cms-sidebar-input"
            value={ctaProps.url ?? '#'}
            onChange={(e) => updateCta({ url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Button Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={ctaProps.buttonColor ?? '#3b82f6'}
              onChange={(e) => updateCta({ buttonColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={ctaProps.buttonColor ?? '#3b82f6'}
              onChange={(e) => updateCta({ buttonColor: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Text Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={ctaProps.buttonTextColor ?? '#ffffff'}
              onChange={(e) => updateCta({ buttonTextColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={ctaProps.buttonTextColor ?? '#ffffff'}
              onChange={(e) => updateCta({ buttonTextColor: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Border Radius</label>
          <select
            className="yoo-cms-sidebar-select"
            value={ctaProps.borderRadius ?? '8px'}
            onChange={(e) => updateCta({ borderRadius: e.target.value })}
          >
            {RADIUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
