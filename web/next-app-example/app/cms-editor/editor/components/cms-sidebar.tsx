import { useEffect, useState, type ComponentType } from 'react';
import { Blocks, type YooEditor, type YooptaBlockData, type YooptaPath } from '@yoopta/editor';
import { CMSPageSettings } from '../page-settings';
import { HeroSettings } from '../plugins/hero/hero-settings';
import { FeaturesGridSettings } from '../plugins/features/features-grid-settings';
import { NavigationSettings } from '../plugins/navigation/navigation-settings';
import { CTABannerSettings } from '../plugins/cta-banner/cta-banner-settings';
import { TestimonialsSettings } from '../plugins/testimonials/testimonials-settings';
import { FooterSettings } from '../plugins/footer/footer-settings';
import { PricingTableSettings } from '../plugins/pricing-table/pricing-table-settings';
import { LogoCloudSettings } from '../plugins/logo-cloud/logo-cloud-settings';
import { FAQSettings } from '../plugins/faq/faq-settings';
import type { CMSBlockSettingsProps } from '../page-settings';
import './cms-sidebar.css';

const FONT_OPTIONS = [
  { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Menlo, monospace', label: 'Menlo' },
  { value: '"Playfair Display", serif', label: 'Playfair Display' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
];

const MAX_WIDTH_OPTIONS = [
  { value: '768px', label: '768px' },
  { value: '1024px', label: '1024px' },
  { value: '1280px', label: '1280px' },
  { value: '100%', label: 'Full width' },
];

const BLOCK_SETTINGS_MAP: Record<string, ComponentType<CMSBlockSettingsProps>> = {
  Hero: HeroSettings,
  FeaturesGrid: FeaturesGridSettings,
  Navigation: NavigationSettings,
  CTABanner: CTABannerSettings,
  Testimonials: TestimonialsSettings,
  Footer: FooterSettings,
  PricingTable: PricingTableSettings,
  LogoCloud: LogoCloudSettings,
  FAQ: FAQSettings,
};

type CMSSidebarProps = {
  editor: YooEditor;
  pageSettings: CMSPageSettings;
  onPageSettingsChange: (settings: CMSPageSettings) => void;
};

export function CMSSidebar({ editor, pageSettings, onPageSettingsChange }: CMSSidebarProps) {
  const [activeTab, setActiveTab] = useState<'page' | 'block'>('page');
  const [activeBlock, setActiveBlock] = useState<YooptaBlockData | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const handlePathChange = (path: YooptaPath) => {
      if (path.current !== null && path.current !== undefined) {
        const block = Blocks.getBlock(editor, { at: path.current });
        if (block) {
          setActiveBlock(block);
          if (BLOCK_SETTINGS_MAP[block.type]) {
            setActiveTab('block');
          }
          return;
        }
      }
      setActiveBlock(null);
    };

    editor.on('path-change', handlePathChange);
    return () => {
      editor.off('path-change', handlePathChange);
    };
  }, [editor]);

  const updateSetting = <K extends keyof CMSPageSettings>(key: K, value: CMSPageSettings[K]) => {
    onPageSettingsChange({ ...pageSettings, [key]: value });
  };

  const SettingsComponent = activeBlock ? BLOCK_SETTINGS_MAP[activeBlock.type] : null;

  return (
    <div className="yoo-cms-sidebar" data-expanded={expanded}>
      <div className="yoo-cms-sidebar-header">
        <button
          className="yoo-cms-sidebar-toggle"
          onClick={() => setExpanded((prev) => !prev)}
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {expanded && (
          <a
            href="/cms-editor/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="yoo-cms-sidebar-preview-btn"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Preview
          </a>
        )}
      </div>

      <div className="yoo-cms-sidebar-inner">
        <div className="yoo-cms-sidebar-tabs">
          <button
            className="yoo-cms-sidebar-tab"
            data-active={activeTab === 'page'}
            onClick={() => setActiveTab('page')}
          >
            Page
          </button>
          <button
            className="yoo-cms-sidebar-tab"
            data-active={activeTab === 'block'}
            onClick={() => setActiveTab('block')}
          >
            Block
          </button>
        </div>

        <div className="yoo-cms-sidebar-content">
          {activeTab === 'page' && (
            <>
              <div className="yoo-cms-sidebar-section">
                <div className="yoo-cms-sidebar-section-title">Typography</div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Font Family</label>
                  <select
                    className="yoo-cms-sidebar-select"
                    value={pageSettings.fontFamily}
                    onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  >
                    {FONT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="yoo-cms-sidebar-section">
                <div className="yoo-cms-sidebar-section-title">Colors</div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Background</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={pageSettings.background}
                      onChange={(e) => updateSetting('background', e.target.value)}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={pageSettings.background}
                      onChange={(e) => updateSetting('background', e.target.value)}
                    />
                  </div>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Primary</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={pageSettings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={pageSettings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Secondary</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={pageSettings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={pageSettings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Accent</label>
                  <div className="yoo-cms-sidebar-color-row">
                    <input
                      type="color"
                      className="yoo-cms-sidebar-color-swatch"
                      value={pageSettings.accentColor}
                      onChange={(e) => updateSetting('accentColor', e.target.value)}
                    />
                    <input
                      className="yoo-cms-sidebar-input"
                      value={pageSettings.accentColor}
                      onChange={(e) => updateSetting('accentColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="yoo-cms-sidebar-section">
                <div className="yoo-cms-sidebar-section-title">Layout</div>
                <div className="yoo-cms-sidebar-field">
                  <label className="yoo-cms-sidebar-label">Max Width</label>
                  <select
                    className="yoo-cms-sidebar-select"
                    value={pageSettings.maxWidth}
                    onChange={(e) => updateSetting('maxWidth', e.target.value)}
                  >
                    {MAX_WIDTH_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'block' && (
            <>
              {SettingsComponent && activeBlock ? (
                <SettingsComponent editor={editor} blockId={activeBlock.id} />
              ) : (
                <div className="yoo-cms-sidebar-empty">
                  <div className="yoo-cms-sidebar-empty-icon">&#9881;</div>
                  <div className="yoo-cms-sidebar-empty-text">
                    {activeBlock
                      ? `No settings available for ${activeBlock.type} block`
                      : 'Click on a block to see its settings'}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
