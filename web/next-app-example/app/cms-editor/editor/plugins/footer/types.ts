import type { SlateElement } from '@yoopta/editor';

export type FooterLayout = 'simple' | 'columns' | 'centered';
export type FooterPaddingY = 'sm' | 'md' | 'lg' | 'xl';

export type FooterProps = {
  layout: FooterLayout;
  backgroundColor: string;
  paddingY: FooterPaddingY;
  borderTop: boolean;
  borderColor: string;
};

export type FooterBrandProps = {
  color: string;
  fontSize: string;
};

export type FooterDescriptionProps = {
  color: string;
};

export type FooterColumnTitleProps = {
  color: string;
};

export type FooterLinkProps = {
  url: string;
  color: string;
};

export type FooterCopyrightProps = {
  color: string;
};

export type FooterElement = SlateElement<'footer', FooterProps>;
export type FooterBrandElement = SlateElement<'footer-brand', FooterBrandProps>;
export type FooterDescriptionElement = SlateElement<'footer-description', FooterDescriptionProps>;
export type FooterColumnElement = SlateElement<'footer-column'>;
export type FooterColumnTitleElement = SlateElement<'footer-column-title', FooterColumnTitleProps>;
export type FooterLinkElement = SlateElement<'footer-link', FooterLinkProps>;
export type FooterCopyrightElement = SlateElement<'footer-copyright', FooterCopyrightProps>;

export type FooterElementMap = {
  footer: FooterElement;
  'footer-brand': FooterBrandElement;
  'footer-description': FooterDescriptionElement;
  'footer-column': FooterColumnElement;
  'footer-column-title': FooterColumnTitleElement;
  'footer-link': FooterLinkElement;
  'footer-copyright': FooterCopyrightElement;
};
