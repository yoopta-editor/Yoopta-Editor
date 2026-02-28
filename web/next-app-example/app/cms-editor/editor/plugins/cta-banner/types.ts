import type { SlateElement } from '@yoopta/editor';

export type CTABannerVariant = 'centered' | 'inline' | 'stacked';
export type CTABannerBackgroundType = 'color' | 'gradient';
export type CTABannerPaddingY = 'sm' | 'md' | 'lg' | 'xl';

export type CTABannerProps = {
  variant: CTABannerVariant;
  backgroundType: CTABannerBackgroundType;
  backgroundColor: string;
  gradient: string;
  borderRadius: string;
  paddingY: CTABannerPaddingY;
  bordered: boolean;
  borderColor: string;
};

export type CTAHeadingProps = {
  color: string;
  fontSize: 'xl' | '2xl' | '3xl' | '4xl';
};

export type CTADescriptionProps = {
  color: string;
};

export type CTAButtonVariant = 'primary' | 'secondary' | 'outline';

export type CTAButtonProps = {
  url: string;
  variant: CTAButtonVariant;
  buttonColor: string;
  buttonTextColor: string;
  borderRadius: string;
};

export type CTABannerElementKeys =
  | 'cta-banner'
  | 'cta-heading'
  | 'cta-description'
  | 'cta-buttons'
  | 'cta-button';

export type CTABannerElement = SlateElement<'cta-banner', CTABannerProps>;
export type CTAHeadingElement = SlateElement<'cta-heading', CTAHeadingProps>;
export type CTADescriptionElement = SlateElement<'cta-description', CTADescriptionProps>;
export type CTAButtonsElement = SlateElement<'cta-buttons'>;
export type CTAButtonElement = SlateElement<'cta-button', CTAButtonProps>;

export type CTABannerElementMap = {
  'cta-banner': CTABannerElement;
  'cta-heading': CTAHeadingElement;
  'cta-description': CTADescriptionElement;
  'cta-buttons': CTAButtonsElement;
  'cta-button': CTAButtonElement;
};
