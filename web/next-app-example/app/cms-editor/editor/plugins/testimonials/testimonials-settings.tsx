import { Elements, serializeTextNodes } from '@yoopta/editor';
import { useRef } from 'react';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  TestimonialsProps,
  TestimonialsColumns,
  TestimonialsVariant,
  TestimonialsPaddingY,
  TestimonialsHeadingProps,
  TestimonialsDescriptionProps,
  TestimonialCardProps,
  TestimonialQuoteProps,
  TestimonialAuthorProps,
  TestimonialRoleProps,
} from './types';

const COLUMNS_OPTIONS: { value: TestimonialsColumns; label: string }[] = [
  { value: 1, label: '1 Column' },
  { value: 2, label: '2 Columns' },
  { value: 3, label: '3 Columns' },
];

const VARIANT_OPTIONS: { value: TestimonialsVariant; label: string }[] = [
  { value: 'cards', label: 'Cards' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'quote', label: 'Quote (left border)' },
];

const PADDING_OPTIONS: { value: TestimonialsPaddingY; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const RATING_OPTIONS = [
  { value: 0, label: 'None' },
  { value: 3, label: '3 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 5, label: '5 Stars' },
];

export function TestimonialsSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const gridEl = Elements.getElement(editor, { blockId, type: 'testimonials' });
  const headingEl = Elements.getElement(editor, { blockId, type: 'testimonials-heading' });
  const descEl = Elements.getElement(editor, { blockId, type: 'testimonials-description' });
  const cards = Elements.getElements(editor, { blockId, type: 'testimonial-card' });

  if (!gridEl) return null;

  const gridProps = (gridEl.props ?? {}) as Partial<TestimonialsProps>;
  const headingProps = (headingEl?.props ?? {}) as Partial<TestimonialsHeadingProps>;
  const descProps = (descEl?.props ?? {}) as Partial<TestimonialsDescriptionProps>;

  const updateGrid = (props: Partial<TestimonialsProps>) => {
    Elements.updateElement(editor, { blockId, type: 'testimonials', props });
  };

  const updateHeading = (props: Partial<TestimonialsHeadingProps>) => {
    Elements.updateElement(editor, { blockId, type: 'testimonials-heading', props });
  };

  const updateDescription = (props: Partial<TestimonialsDescriptionProps>) => {
    Elements.updateElement(editor, { blockId, type: 'testimonials-description', props });
  };

  const updateCard = (cardEl: any, props: Partial<TestimonialCardProps>) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'testimonial-card',
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
            value={gridProps.columns ?? 3}
            onChange={(e) => updateGrid({ columns: Number(e.target.value) as TestimonialsColumns })}
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
            value={gridProps.variant ?? 'cards'}
            onChange={(e) => updateGrid({ variant: e.target.value as TestimonialsVariant })}
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
            onChange={(e) => updateGrid({ paddingY: e.target.value as TestimonialsPaddingY })}
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
      {cards.length > 0 && (
        <div className="yoo-cms-sidebar-section">
          <div className="yoo-cms-sidebar-section-title">Testimonials</div>
          {cards.map((card, idx) => {
            const cProps = (card.props ?? {}) as Partial<TestimonialCardProps>;
            const authorEl = card.children?.find(
              (c: any) => c.type === 'testimonial-author',
            );
            const authorText = authorEl ? serializeTextNodes(authorEl.children) : `Card ${idx + 1}`;

            return (
              <div key={card.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: idx < cards.length - 1 ? '1px solid #e5e7eb' : undefined }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  {authorText}
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Rating</label>
                  <select
                    className="yoo-cms-sidebar-select"
                    value={cProps.rating ?? 5}
                    onChange={(e) => updateCard(card, { rating: Number(e.target.value) })}
                  >
                    {RATING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <AvatarUploader
                  avatar={cProps.avatar ?? ''}
                  onChange={(avatar) => updateCard(card, { avatar })}
                />
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Accent Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={cProps.accentColor ?? '#3b82f6'}
                      onChange={(e) => updateCard(card, { accentColor: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={cProps.accentColor ?? '#3b82f6'}
                      onChange={(e) => updateCard(card, { accentColor: e.target.value })}
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

function AvatarUploader({ avatar, onChange }: { avatar: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(URL.createObjectURL(file));
    e.target.value = '';
  };

  return (
    <div className="yoo-cms-sidebar-field">
      <label className="yoo-cms-sidebar-label">Avatar</label>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      {avatar ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
          <button
            className="yoo-cms-sidebar-upload-btn"
            onClick={() => inputRef.current?.click()}
            onMouseDown={(e) => e.preventDefault()}
            style={{ fontSize: 12 }}
          >
            Change
          </button>
          <button
            className="yoo-cms-sidebar-upload-btn"
            onClick={() => onChange('')}
            onMouseDown={(e) => e.preventDefault()}
            style={{ fontSize: 12, color: '#ef4444' }}
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          className="yoo-cms-sidebar-upload-btn"
          onClick={() => inputRef.current?.click()}
          onMouseDown={(e) => e.preventDefault()}
        >
          Upload avatar
        </button>
      )}
    </div>
  );
}
