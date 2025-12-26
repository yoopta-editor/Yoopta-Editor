import type { SlateElement } from '@yoopta/editor';

export type CarouselListItemElementProps = {
  order: number;
};

export type CarouselContainerElement = SlateElement<'carousel-container'>;
export type CarouselListElement = SlateElement<'carousel-list'>;
export type CarouselListItemElement = SlateElement<
  'carousel-list-item',
  CarouselListItemElementProps
>;
export type CarouselListItemHeadingElement = SlateElement<'carousel-list-item-heading'>;
export type CarouselListItemContentElement = SlateElement<'carousel-list-item-content'>;

export type CarouselElementMap = {
  'carousel-container': CarouselContainerElement;
  'carousel-list': CarouselListElement;
  'carousel-list-item': CarouselListItemElement;
  'carousel-list-item-heading': CarouselListItemHeadingElement;
  'carousel-list-item-content': CarouselListItemContentElement;
};
