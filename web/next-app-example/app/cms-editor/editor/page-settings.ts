export type CMSPageSettings = {
  fontFamily: string;
  background: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  maxWidth: string;
};

export const DEFAULT_PAGE_SETTINGS: CMSPageSettings = {
  fontFamily: 'Inter, system-ui, sans-serif',
  background: '#ffffff',
  primaryColor: '#3b82f6',
  secondaryColor: '#1e293b',
  accentColor: '#8b5cf6',
  maxWidth: '100%',
};

export type CMSBlockSettingsProps = {
  editor: any;
  blockId: string;
};
