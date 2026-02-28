import type { SlateElement } from '@yoopta/editor';

export type FeaturesGridColumns = 2 | 3 | 4;
export type FeaturesGridVariant = 'cards' | 'minimal' | 'bordered';
export type FeaturesGridPaddingY = 'sm' | 'md' | 'lg' | 'xl';

export type FeaturesGridProps = {
  columns: FeaturesGridColumns;
  variant: FeaturesGridVariant;
  paddingY: FeaturesGridPaddingY;
  backgroundColor: string;
  showIcons: boolean;
};

export type FeaturesHeadingProps = {
  color: string;
};

export type FeaturesDescriptionProps = {
  color: string;
};

export type FeatureCardProps = {
  icon: string;
  iconColor: string;
};

export type FeatureCardTitleProps = {
  color: string;
};

export type FeatureCardDescriptionProps = {
  color: string;
};

export type FeaturesGridElement = SlateElement<'features-grid', FeaturesGridProps>;
export type FeaturesHeadingElement = SlateElement<'features-heading', FeaturesHeadingProps>;
export type FeaturesDescriptionElement = SlateElement<'features-description', FeaturesDescriptionProps>;
export type FeatureCardElement = SlateElement<'feature-card', FeatureCardProps>;
export type FeatureCardTitleElement = SlateElement<'feature-card-title', FeatureCardTitleProps>;
export type FeatureCardDescriptionElement = SlateElement<'feature-card-description', FeatureCardDescriptionProps>;

export type FeaturesGridElementMap = {
  'features-grid': FeaturesGridElement;
  'features-heading': FeaturesHeadingElement;
  'features-description': FeaturesDescriptionElement;
  'feature-card': FeatureCardElement;
  'feature-card-title': FeatureCardTitleElement;
  'feature-card-description': FeatureCardDescriptionElement;
};
