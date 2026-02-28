import type { SlateElement } from '@yoopta/editor';

export type NavLayout = 'standard' | 'centered' | 'minimal';
export type NavPosition = 'sticky' | 'fixed' | 'static';

export type NavigationProps = {
  layout: NavLayout;
  position: NavPosition;
  backgroundColor: string;
  transparent: boolean;
  borderBottom: boolean;
  paddingX: string;
  height: string;
};

export type NavLogoProps = {
  color: string;
  fontSize: string;
  fontWeight: string;
};

export type NavLinkProps = {
  url: string;
  color: string;
};

export type NavCtaProps = {
  url: string;
  buttonColor: string;
  buttonTextColor: string;
  borderRadius: string;
};

export type NavigationElement = SlateElement<'navigation', NavigationProps>;
export type NavLogoElement = SlateElement<'nav-logo', NavLogoProps>;
export type NavLinksElement = SlateElement<'nav-links'>;
export type NavLinkElement = SlateElement<'nav-link', NavLinkProps>;
export type NavCtaElement = SlateElement<'nav-cta', NavCtaProps>;

export type NavigationElementMap = {
  navigation: NavigationElement;
  'nav-logo': NavLogoElement;
  'nav-links': NavLinksElement;
  'nav-link': NavLinkElement;
  'nav-cta': NavCtaElement;
};
