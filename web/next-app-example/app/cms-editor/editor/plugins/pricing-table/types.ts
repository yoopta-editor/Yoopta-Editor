import type { SlateElement } from '@yoopta/editor';

export type PricingColumns = 2 | 3 | 4;
export type PricingVariant = 'cards' | 'bordered' | 'flat';
export type PricingPaddingY = 'sm' | 'md' | 'lg' | 'xl';

export type PricingTableProps = {
  columns: PricingColumns;
  variant: PricingVariant;
  paddingY: PricingPaddingY;
  backgroundColor: string;
};

export type PricingHeadingProps = {
  color: string;
};

export type PricingDescriptionProps = {
  color: string;
};

export type PricingTierProps = {
  featured: boolean;
  accentColor: string;
  backgroundColor: string;
};

export type PricingTierNameProps = {
  color: string;
};

export type PricingTierPriceProps = {
  color: string;
};

export type PricingTierPeriodProps = {
  color: string;
};

export type PricingTierFeatureProps = {
  color: string;
  included: boolean;
};

export type PricingTierButtonProps = {
  url: string;
  variant: 'primary' | 'outline';
  buttonColor: string;
  buttonTextColor: string;
  borderRadius: string;
};

export type PricingTableElement = SlateElement<'pricing-table', PricingTableProps>;
export type PricingHeadingElement = SlateElement<'pricing-heading', PricingHeadingProps>;
export type PricingDescriptionElement = SlateElement<'pricing-description', PricingDescriptionProps>;
export type PricingTierElement = SlateElement<'pricing-tier', PricingTierProps>;
export type PricingTierNameElement = SlateElement<'pricing-tier-name', PricingTierNameProps>;
export type PricingTierPriceElement = SlateElement<'pricing-tier-price', PricingTierPriceProps>;
export type PricingTierPeriodElement = SlateElement<'pricing-tier-period', PricingTierPeriodProps>;
export type PricingTierFeatureElement = SlateElement<'pricing-tier-feature', PricingTierFeatureProps>;
export type PricingTierButtonElement = SlateElement<'pricing-tier-button', PricingTierButtonProps>;

export type PricingTableElementMap = {
  'pricing-table': PricingTableElement;
  'pricing-heading': PricingHeadingElement;
  'pricing-description': PricingDescriptionElement;
  'pricing-tier': PricingTierElement;
  'pricing-tier-name': PricingTierNameElement;
  'pricing-tier-price': PricingTierPriceElement;
  'pricing-tier-period': PricingTierPeriodElement;
  'pricing-tier-feature': PricingTierFeatureElement;
  'pricing-tier-button': PricingTierButtonElement;
};
