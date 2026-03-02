import type { SlateElement } from '@yoopta/editor';

export type LogoCloudColumns = 3 | 4 | 5 | 6;
export type LogoCloudPaddingY = 'sm' | 'md' | 'lg' | 'xl';

export type LogoCloudProps = {
  columns: LogoCloudColumns;
  paddingY: LogoCloudPaddingY;
  backgroundColor: string;
  grayscale: boolean;
};

export type LogoCloudHeadingProps = {
  color: string;
};

export type LogoCloudDescriptionProps = {
  color: string;
};

export type LogoItemProps = {
  color: string;
  backgroundColor: string;
};

export type LogoCloudElement = SlateElement<'logo-cloud', LogoCloudProps>;
export type LogoCloudHeadingElement = SlateElement<'logo-cloud-heading', LogoCloudHeadingProps>;
export type LogoCloudDescriptionElement = SlateElement<'logo-cloud-description', LogoCloudDescriptionProps>;
export type LogoItemElement = SlateElement<'logo-item', LogoItemProps>;

export type LogoCloudElementMap = {
  'logo-cloud': LogoCloudElement;
  'logo-cloud-heading': LogoCloudHeadingElement;
  'logo-cloud-description': LogoCloudDescriptionElement;
  'logo-item': LogoItemElement;
};
