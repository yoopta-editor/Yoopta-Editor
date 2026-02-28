import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Callout from '@yoopta/callout';
import Link from '@yoopta/link';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import Image from '@yoopta/image';
import Divider from '@yoopta/divider';
import Code from '@yoopta/code';
import Table from '@yoopta/table';

// CMS Plugins
import { HeroPlugin } from './plugins/hero/hero-plugin';
import { FeaturesGridPlugin } from './plugins/features/features-grid-plugin';
import { NavigationPlugin } from './plugins/navigation/navigation-plugin';
import { CTABannerPlugin } from './plugins/cta-banner/cta-banner-plugin';
import { PricingTablePlugin } from './plugins/pricing-table/pricing-table-plugin';
import { TestimonialsPlugin } from './plugins/testimonials/testimonials-plugin';
import { FooterPlugin } from './plugins/footer/footer-plugin';

const YImage = Image.extend({
  options: {
    upload: async (file) => {
      return {
        id: file.name,
        src: URL.createObjectURL(file),
        alt: file.name,
        fit: 'cover',
        sizes: {
          width: file.size,
          height: file.size,
        },
      };
    },
  },
});

export const CMS_PLUGINS = [
  // Standard editor plugins
  Paragraph,
  // HeadingOne.extend({
  //   elements: {
  //     'heading-one': {
  //       placeholder: 'Heading 1',
  //     },
  //   },
  // }),
  // HeadingTwo,
  // HeadingThree,
  // Blockquote,
  // Callout,
  // Link,
  // NumberedList,
  // BulletedList,
  // TodoList,
  // YImage,
  // Divider,
  // Code.Code,
  // Table,

  // CMS Section Plugins
  HeroPlugin,
  FeaturesGridPlugin,
  NavigationPlugin,
  CTABannerPlugin,
  TestimonialsPlugin,
  FooterPlugin,
  PricingTablePlugin,
];
