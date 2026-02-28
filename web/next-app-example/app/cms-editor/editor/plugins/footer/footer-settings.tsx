import { Elements } from '@yoopta/editor';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  FooterProps,
  FooterLayout,
  FooterPaddingY,
  FooterBrandProps,
  FooterDescriptionProps,
  FooterColumnTitleProps,
  FooterLinkProps,
  FooterCopyrightProps,
} from './types';

const LAYOUT_OPTIONS: { value: FooterLayout; label: string }[] = [
  { value: 'simple', label: 'Simple (brand + columns)' },
  { value: 'columns', label: 'Columns (stacked)' },
  { value: 'centered', label: 'Centered' },
];

const PADDING_OPTIONS: { value: FooterPaddingY; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

export function FooterSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const footerEl = Elements.getElement(editor, { blockId, type: 'footer' });
  const brandEl = Elements.getElement(editor, { blockId, type: 'footer-brand' });
  const descEl = Elements.getElement(editor, { blockId, type: 'footer-description' });
  const copyrightEl = Elements.getElement(editor, { blockId, type: 'footer-copyright' });
  const columnTitles = Elements.getElements(editor, { blockId, type: 'footer-column-title' });
  const links = Elements.getElements(editor, { blockId, type: 'footer-link' });

  if (!footerEl) return null;

  const footerProps = (footerEl.props ?? {}) as Partial<FooterProps>;
  const brandProps = (brandEl?.props ?? {}) as Partial<FooterBrandProps>;
  const descProps = (descEl?.props ?? {}) as Partial<FooterDescriptionProps>;
  const copyrightProps = (copyrightEl?.props ?? {}) as Partial<FooterCopyrightProps>;

  const updateFooter = (props: Partial<FooterProps>) => {
    Elements.updateElement(editor, { blockId, type: 'footer', props });
  };

  const updateBrand = (props: Partial<FooterBrandProps>) => {
    Elements.updateElement(editor, { blockId, type: 'footer-brand', props });
  };

  const updateDescription = (props: Partial<FooterDescriptionProps>) => {
    Elements.updateElement(editor, { blockId, type: 'footer-description', props });
  };

  const updateCopyright = (props: Partial<FooterCopyrightProps>) => {
    Elements.updateElement(editor, { blockId, type: 'footer-copyright', props });
  };

  const updateAllColumnTitles = (props: Partial<FooterColumnTitleProps>) => {
    columnTitles.forEach((title) => {
      Elements.updateElement(editor, {
        blockId,
        type: 'footer-column-title',
        props,
        match: (el) => el.id === title.id,
      });
    });
  };

  const updateAllLinks = (props: Partial<FooterLinkProps>) => {
    links.forEach((link) => {
      Elements.updateElement(editor, {
        blockId,
        type: 'footer-link',
        props,
        match: (el) => el.id === link.id,
      });
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
            value={footerProps.layout ?? 'simple'}
            onChange={(e) => updateFooter({ layout: e.target.value as FooterLayout })}
          >
            {LAYOUT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Padding</label>
          <select
            className="yoo-cms-sidebar-select"
            value={footerProps.paddingY ?? 'lg'}
            onChange={(e) => updateFooter({ paddingY: e.target.value as FooterPaddingY })}
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
              value={footerProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateFooter({ backgroundColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={footerProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateFooter({ backgroundColor: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={footerProps.borderTop ?? true}
              onChange={(e) => updateFooter({ borderTop: e.target.checked })}
            />
            Top border
          </label>
        </div>
        {footerProps.borderTop && (
          <div className="yoo-cms-sidebar-field">
            <label className="yoo-cms-sidebar-label">Border Color</label>
            <div className="yoo-cms-sidebar-color-row">
              <input
                type="color"
                className="yoo-cms-sidebar-color-swatch"
                value={footerProps.borderColor ?? '#e5e7eb'}
                onChange={(e) => updateFooter({ borderColor: e.target.value })}
              />
              <input
                className="yoo-cms-sidebar-input"
                value={footerProps.borderColor ?? '#e5e7eb'}
                onChange={(e) => updateFooter({ borderColor: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Brand</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={brandProps.color ?? '#111827'}
              onChange={(e) => updateBrand({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={brandProps.color ?? '#111827'}
              onChange={(e) => updateBrand({ color: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Font Size</label>
          <input
            className="yoo-cms-sidebar-input"
            value={brandProps.fontSize ?? '1.25rem'}
            onChange={(e) => updateBrand({ fontSize: e.target.value })}
            placeholder="1.25rem"
          />
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

      {/* Column Titles & Links (bulk color) */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Columns</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Title Color (all)</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={(columnTitles[0]?.props as any)?.color ?? '#111827'}
              onChange={(e) => updateAllColumnTitles({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={(columnTitles[0]?.props as any)?.color ?? '#111827'}
              onChange={(e) => updateAllColumnTitles({ color: e.target.value })}
            />
          </div>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Link Color (all)</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={(links[0]?.props as any)?.color ?? '#6b7280'}
              onChange={(e) => updateAllLinks({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={(links[0]?.props as any)?.color ?? '#6b7280'}
              onChange={(e) => updateAllLinks({ color: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="yoo-cms-sidebar-section">
        <div className="yoo-cms-sidebar-section-title">Copyright</div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Color</label>
          <div className="yoo-cms-sidebar-color-row">
            <input
              type="color"
              className="yoo-cms-sidebar-color-swatch"
              value={copyrightProps.color ?? '#9ca3af'}
              onChange={(e) => updateCopyright({ color: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={copyrightProps.color ?? '#9ca3af'}
              onChange={(e) => updateCopyright({ color: e.target.value })}
            />
          </div>
        </div>
      </div>
    </>
  );
}
