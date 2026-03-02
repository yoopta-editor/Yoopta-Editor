import type { SlateElement } from '@yoopta/editor';

export type FAQVariant = 'default' | 'bordered' | 'separated';
export type FAQPaddingY = 'sm' | 'md' | 'lg' | 'xl';
export type FAQIconStyle = 'plus' | 'chevron';

export type FAQProps = {
  variant: FAQVariant;
  paddingY: FAQPaddingY;
  backgroundColor: string;
  iconStyle: FAQIconStyle;
};

export type FAQHeadingProps = {
  color: string;
};

export type FAQDescriptionProps = {
  color: string;
};

export type FAQItemProps = {
  isExpanded: boolean;
  borderColor: string;
};

export type FAQItemQuestionProps = {
  color: string;
};

export type FAQItemAnswerProps = {
  color: string;
};

export type FAQElement = SlateElement<'faq', FAQProps>;
export type FAQHeadingElement = SlateElement<'faq-heading', FAQHeadingProps>;
export type FAQDescriptionElement = SlateElement<'faq-description', FAQDescriptionProps>;
export type FAQItemElement = SlateElement<'faq-item', FAQItemProps>;
export type FAQItemQuestionElement = SlateElement<'faq-item-question', FAQItemQuestionProps>;
export type FAQItemAnswerElement = SlateElement<'faq-item-answer', FAQItemAnswerProps>;

export type FAQElementMap = {
  faq: FAQElement;
  'faq-heading': FAQHeadingElement;
  'faq-description': FAQDescriptionElement;
  'faq-item': FAQItemElement;
  'faq-item-question': FAQItemQuestionElement;
  'faq-item-answer': FAQItemAnswerElement;
};
