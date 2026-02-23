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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
