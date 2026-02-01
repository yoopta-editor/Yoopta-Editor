import type { SlateElement } from '@yoopta/editor';

export type StepListItemElementProps = {
  order: number;
};

export type StepContainerElement = SlateElement<'step-container'>;
export type StepListElement = SlateElement<'step-list'>;
export type StepListItemElement = SlateElement<'step-list-item', StepListItemElementProps>;
export type StepListItemHeadingElement = SlateElement<'step-list-item-heading'>;
export type StepListItemContentElement = SlateElement<'step-list-item-content'>;

export type StepsElementMap = {
  'step-container': StepContainerElement;
  'step-list': StepListElement;
  'step-list-item': StepListItemElement;
  'step-list-item-heading': StepListItemHeadingElement;
  'step-list-item-content': StepListItemContentElement;
};
