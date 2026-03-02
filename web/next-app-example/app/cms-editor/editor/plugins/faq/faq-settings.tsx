import { Elements, serializeTextNodes } from '@yoopta/editor';
import type { CMSBlockSettingsProps } from '../../page-settings';
import type {
  FAQProps,
  FAQVariant,
  FAQPaddingY,
  FAQIconStyle,
  FAQHeadingProps,
  FAQDescriptionProps,
  FAQItemProps,
  FAQItemQuestionProps,
  FAQItemAnswerProps,
} from './types';

const VARIANT_OPTIONS: { value: FAQVariant; label: string }[] = [
  { value: 'default', label: 'Default (dividers)' },
  { value: 'bordered', label: 'Bordered' },
  { value: 'separated', label: 'Separated (cards)' },
];

const PADDING_OPTIONS: { value: FAQPaddingY; label: string }[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

const ICON_OPTIONS: { value: FAQIconStyle; label: string }[] = [
  { value: 'plus', label: 'Plus / Minus' },
  { value: 'chevron', label: 'Chevron' },
];

export function FAQSettings({ editor, blockId }: CMSBlockSettingsProps) {
  const faqEl = Elements.getElement(editor, { blockId, type: 'faq' });
  const headingEl = Elements.getElement(editor, { blockId, type: 'faq-heading' });
  const descEl = Elements.getElement(editor, { blockId, type: 'faq-description' });
  const items = Elements.getElements(editor, { blockId, type: 'faq-item' });

  if (!faqEl) return null;

  const faqProps = (faqEl.props ?? {}) as Partial<FAQProps>;
  const headingProps = (headingEl?.props ?? {}) as Partial<FAQHeadingProps>;
  const descProps = (descEl?.props ?? {}) as Partial<FAQDescriptionProps>;

  const updateFAQ = (props: Partial<FAQProps>) => {
    Elements.updateElement(editor, { blockId, type: 'faq', props });
  };

  const updateHeading = (props: Partial<FAQHeadingProps>) => {
    Elements.updateElement(editor, { blockId, type: 'faq-heading', props });
  };

  const updateDescription = (props: Partial<FAQDescriptionProps>) => {
    Elements.updateElement(editor, { blockId, type: 'faq-description', props });
  };

  const updateItem = (itemEl: any, props: Partial<FAQItemProps>) => {
    Elements.updateElement(editor, {
      blockId,
      type: 'faq-item',
      props,
      match: (el) => el.id === itemEl.id,
    });
  };

  const updateItemQuestion = (itemEl: any, props: Partial<FAQItemQuestionProps>) => {
    // Find the question child of this specific item
    const questionEl = itemEl.children?.find((c: any) => c.type === 'faq-item-question');
    if (!questionEl) return;
    Elements.updateElement(editor, {
      blockId,
      type: 'faq-item-question',
      props,
      match: (el) => el.id === questionEl.id,
    });
  };

  const updateItemAnswer = (itemEl: any, props: Partial<FAQItemAnswerProps>) => {
    const answerEl = itemEl.children?.find((c: any) => c.type === 'faq-item-answer');
    if (!answerEl) return;
    Elements.updateElement(editor, {
      blockId,
      type: 'faq-item-answer',
      props,
      match: (el) => el.id === answerEl.id,
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
            value={faqProps.variant ?? 'default'}
            onChange={(e) => updateFAQ({ variant: e.target.value as FAQVariant })}
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
            value={faqProps.paddingY ?? 'lg'}
            onChange={(e) => updateFAQ({ paddingY: e.target.value as FAQPaddingY })}
          >
            {PADDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="yoo-cms-sidebar-field">
          <label className="yoo-cms-sidebar-label">Icon Style</label>
          <select
            className="yoo-cms-sidebar-select"
            value={faqProps.iconStyle ?? 'plus'}
            onChange={(e) => updateFAQ({ iconStyle: e.target.value as FAQIconStyle })}
          >
            {ICON_OPTIONS.map((opt) => (
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
              value={faqProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateFAQ({ backgroundColor: e.target.value })}
            />
            <input
              className="yoo-cms-sidebar-input"
              value={faqProps.backgroundColor ?? '#ffffff'}
              onChange={(e) => updateFAQ({ backgroundColor: e.target.value })}
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

      {/* FAQ Items */}
      {items.length > 0 && (
        <div className="yoo-cms-sidebar-section">
          <div className="yoo-cms-sidebar-section-title">FAQ Items</div>
          {items.map((item, idx) => {
            const iProps = (item.props ?? {}) as Partial<FAQItemProps>;
            const questionEl = item.children?.find((c: any) => c.type === 'faq-item-question');
            const answerEl = item.children?.find((c: any) => c.type === 'faq-item-answer');
            const questionText = questionEl ? serializeTextNodes(questionEl.children) : `Item ${idx + 1}`;
            const qProps = (questionEl?.props ?? {}) as Partial<FAQItemQuestionProps>;
            const aProps = (answerEl?.props ?? {}) as Partial<FAQItemAnswerProps>;

            return (
              <div key={item.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: idx < items.length - 1 ? '1px solid #e5e7eb' : undefined }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>
                  {questionText}
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Question Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={qProps.color ?? '#111827'}
                      onChange={(e) => updateItemQuestion(item, { color: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={qProps.color ?? '#111827'}
                      onChange={(e) => updateItemQuestion(item, { color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Answer Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={aProps.color ?? '#4b5563'}
                      onChange={(e) => updateItemAnswer(item, { color: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={aProps.color ?? '#4b5563'}
                      onChange={(e) => updateItemAnswer(item, { color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Border Color</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={iProps.borderColor ?? '#e5e7eb'}
                      onChange={(e) => updateItem(item, { borderColor: e.target.value })}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={iProps.borderColor ?? '#e5e7eb'}
                      onChange={(e) => updateItem(item, { borderColor: e.target.value })}
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
