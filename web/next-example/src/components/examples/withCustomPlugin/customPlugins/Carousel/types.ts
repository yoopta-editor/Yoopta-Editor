import { SlateElement } from '@yoopta/editor';

export type CarouselElementProps = {
  loop: boolean;
  orientation: 'horizontal' | 'vertical';
};

export type CarouselItemImageElementProps = {
  src: null | string;
};

export type CarouselElement = SlateElement<'carousel', CarouselElementProps>;
export type CarouselItemElement = SlateElement<'carousel-item'>;
export type CarouselItemImageElement = SlateElement<
  'carousel-item-image',
  CarouselItemImageElementProps
>;
export type CarouselItemTitleElement = SlateElement<'carousel-item-title'>;
export type CarouselItemDescriptionElement = SlateElement<'carousel-item-description'>;
