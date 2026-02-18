import { createRollupConfig } from '../../../config/rollup';

const pkg = require('./package.json');

const tailwindConfig = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        border: 'hsl(var(--yoopta-shadcn-border))',
        input: 'hsl(var(--yoopta-shadcn-input))',
        ring: 'hsl(var(--yoopta-shadcn-ring))',
        background: 'hsl(var(--yoopta-shadcn-background))',
        foreground: 'hsl(var(--yoopta-shadcn-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--yoopta-shadcn-primary))',
          foreground: 'hsl(var(--yoopta-shadcn-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--yoopta-shadcn-secondary))',
          foreground: 'hsl(var(--yoopta-shadcn-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--yoopta-shadcn-destructive))',
          foreground: 'hsl(var(--yoopta-shadcn-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--yoopta-shadcn-muted))',
          foreground: 'hsl(var(--yoopta-shadcn-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--yoopta-shadcn-accent))',
          foreground: 'hsl(var(--yoopta-shadcn-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--yoopta-shadcn-popover))',
          foreground: 'hsl(var(--yoopta-shadcn-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--yoopta-shadcn-card))',
          foreground: 'hsl(var(--yoopta-shadcn-card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--yoopta-shadcn-radius)',
        md: 'calc(var(--yoopta-shadcn-radius) - 2px)',
        sm: 'calc(var(--yoopta-shadcn-radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
};

const createMultiEntryConfig = () => {
  const baseConfig = createRollupConfig({
    pkg,
    extractCSS: false,
    tailwindConfig,
  });

  return {
    ...baseConfig,
    input: {
      index: './src/index.ts',
      accordion: './src/accordion/index.ts',
      blockquote: './src/blockquote/index.ts',
      callout: './src/callout/index.ts',
      carousel: './src/carousel/index.ts',
      code: './src/code/index.ts',
      'code-group': './src/code-group/index.ts',
      divider: './src/divider/index.ts',
      embed: './src/embed/index.ts',
      file: './src/file/index.ts',
      headings: './src/headings/index.ts',
      image: './src/image/index.ts',
      link: './src/link/index.ts',
      lists: './src/lists/index.ts',
      mention: './src/mention/index.ts',
      paragraph: './src/paragraph/index.ts',
      steps: './src/steps/index.ts',
      table: './src/table/index.ts',
      'table-of-contents': './src/table-of-contents/index.ts',
      tabs: './src/tabs/index.ts',
      video: './src/video/index.ts',
      emoji: './src/emoji/index.ts',
    },
    output: {
      format: 'es',
      sourcemap: process.env.NODE_ENV === 'development',
      globals: { react: 'React' },
      dir: './dist',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      exports: 'named',
    },
  };
};

export default createMultiEntryConfig();
