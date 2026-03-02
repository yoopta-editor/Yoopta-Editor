import { COMMAND_MENU_DEFAULT_ICONS_MAP } from '@/lib/icons';
import { SlashCommandMenu } from '@yoopta/ui/slash-command-menu';
import { LayoutTemplateIcon, LayoutGridIcon, NavigationIcon, MegaphoneIcon, QuoteIcon, FootprintsIcon, DollarSignIcon, ImageIcon, HelpCircleIcon } from 'lucide-react';

// Extended icons map for CMS plugins
const CMS_ICONS_MAP: Record<string, React.ComponentType<{ width?: number; height?: number }>> = {
  ...COMMAND_MENU_DEFAULT_ICONS_MAP,
  Hero: LayoutTemplateIcon,
  FeaturesGrid: LayoutGridIcon,
  Navigation: NavigationIcon,
  CTABanner: MegaphoneIcon,
  Testimonials: QuoteIcon,
  Footer: FootprintsIcon,
  PricingTable: DollarSignIcon,
  LogoCloud: ImageIcon,
  FAQ: HelpCircleIcon,
};

export const CMSSlashCommandMenu = () => (
  <SlashCommandMenu>
    {(props) => {
      return (
        <SlashCommandMenu.Content>
          <SlashCommandMenu.List>
            <SlashCommandMenu.Empty>No blocks found</SlashCommandMenu.Empty>
            {props.items.map((item) => {
              const Icon = CMS_ICONS_MAP[item.id];

              return (
                <SlashCommandMenu.Item
                  key={item.id}
                  value={item.id}
                  title={item.title}
                  description={item.description}
                  icon={Icon ? <Icon width={20} height={20} /> : null}
                />
              );
            })}
          </SlashCommandMenu.List>
          <SlashCommandMenu.Footer />
        </SlashCommandMenu.Content>
      );
    }}
  </SlashCommandMenu>
);
