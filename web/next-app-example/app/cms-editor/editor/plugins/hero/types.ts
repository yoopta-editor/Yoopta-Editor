import type { SlateElement } from '@yoopta/editor';

export type HeroVariant = 'centered' | 'split' | 'fullwidth';
export type HeroBackgroundType = 'color' | 'gradient' | 'image';
export type HeroBackgroundEffect = 'none' | 'glow' | 'grid';
export type HeroPaddingY = 'sm' | 'md' | 'lg' | 'xl';

export type HeroProps = {
  variant: HeroVariant;
  backgroundType: HeroBackgroundType;
  backgroundColor: string;
  gradient: string;
  backgroundImage: string;
  backgroundEffect: HeroBackgroundEffect;
  overlay: boolean;
  overlayOpacity: number;
  paddingY: HeroPaddingY;
  fullHeight: boolean;
};

export type HeroBadgeVariant = 'pill' | 'outlined' | 'subtle';

export type HeroBadgeProps = {
  variant: HeroBadgeVariant;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  url: string;
};

export type HeroTitleFontSize = '4xl' | '5xl' | '6xl' | '7xl';

export type HeroTitleProps = {
  fontSize: HeroTitleFontSize;
  color: string;
  gradientText: boolean;
  textGradient: string;
};

export type HeroSubtitleFontSize = 'lg' | 'xl' | '2xl';

export type HeroSubtitleProps = {
  fontSize: HeroSubtitleFontSize;
  color: string;
};

export type HeroButtonVariant = 'primary' | 'secondary' | 'outline';
export type HeroButtonSize = 'sm' | 'md' | 'lg';

export type HeroButtonProps = {
  url: string;
  variant: HeroButtonVariant;
  size: HeroButtonSize;
  buttonColor: string;
  buttonTextColor: string;
};

export type HeroElementKeys =
  | 'hero'
  | 'hero-badge'
  | 'hero-title'
  | 'hero-subtitle'
  | 'hero-buttons'
  | 'hero-button';

export type HeroElement = SlateElement<'hero', HeroProps>;
export type HeroBadgeElement = SlateElement<'hero-badge', HeroBadgeProps>;
export type HeroTitleElement = SlateElement<'hero-title', HeroTitleProps>;
export type HeroSubtitleElement = SlateElement<'hero-subtitle', HeroSubtitleProps>;
export type HeroButtonsElement = SlateElement<'hero-buttons'>;
export type HeroButtonElement = SlateElement<'hero-button', HeroButtonProps>;

export type HeroElementMap = {
  hero: HeroElement;
  'hero-badge': HeroBadgeElement;
  'hero-title': HeroTitleElement;
  'hero-subtitle': HeroSubtitleElement;
  'hero-buttons': HeroButtonsElement;
  'hero-button': HeroButtonElement;
};
