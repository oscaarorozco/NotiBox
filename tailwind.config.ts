import type {Config} from 'tailwindcss';
const { fontFamily } = require("tailwindcss/defaultTheme")

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        headline: ['var(--font-headline)', 'monospace'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'slide-up-and-fade': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0, 0)', textShadow: 'none' },
          '10%': { transform: 'translate(-1px, -1px)' },
          '20%': { transform: 'translate(1px, 1px)', textShadow: '1px 1px 0 hsl(var(--primary) / 0.5), -1px -1px 0 hsl(var(--foreground) / 0.3)' },
          '30%': { transform: 'translate(0, 0)' },
          '40%': { transform: 'translate(1px, -1px)' },
          '50%': { transform: 'translate(-1px, 1px)', textShadow: '-1px 1px 0 hsl(var(--primary) / 0.5), 1px -1px 0 hsl(var(--foreground) / 0.3)' },
          '60%': { transform: 'translate(0, 0)' },
          '70%': { transform: 'skewX(-5deg) scale(1.05)', textShadow: 'none' },
          '80%': { transform: 'skewX(0) scale(1)' },
          '90%': { textShadow: '2px 2px 5px hsl(var(--primary) / 0.2)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-up-and-fade': 'slide-up-and-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s infinite',
        'glitch': 'glitch 4s ease-in-out infinite',
      },
       typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.foreground'),
            '--tw-prose-headings': theme('colors.foreground'),
            '--tw-prose-lead': theme('colors.foreground'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.foreground'),
            '--tw-prose-counters': theme('colors.muted.foreground'),
            '--tw-prose-bullets': theme('colors.primary.DEFAULT'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.foreground'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-captions': theme('colors.muted.foreground'),
            '--tw-prose-code': theme('colors.foreground'),
            '--tw-prose-pre-code': theme('colors.card.foreground'),
            '--tw-prose-pre-bg': theme('colors.card.DEFAULT'),
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
            '--tw-prose-invert-body': theme('colors.foreground'),
            '--tw-prose-invert-headings': theme('colors.foreground'),
            '--tw-prose-invert-lead': theme('colors.foreground'),
            '--tw-prose-invert-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-invert-bold': theme('colors.foreground'),
            '--tw-prose-invert-counters': theme('colors.muted.foreground'),
            '--tw-prose-invert-bullets': theme('colors.primary.DEFAULT'),
            '--tw-prose-invert-hr': theme('colors.border'),
            '--tw-prose-invert-quotes': theme('colors.foreground'),
            '--tw-prose-invert-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-invert-captions': theme('colors.muted.foreground'),
            '--tw-prose-invert-code': theme('colors.foreground'),
            '--tw-prose-invert-pre-code': theme('colors.card.foreground'),
            '--tw-prose-invert-pre-bg': theme('colors.card.DEFAULT'),
            '--tw-prose-invert-th-borders': theme('colors.border'),
            '--tw-prose-invert-td-borders': theme('colors.border'),
             h1: {
              fontWeight: '600',
            },
            h2: {
              fontWeight: '600',
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              backgroundColor: theme('colors.card.DEFAULT'),
              padding: '0.2em 0.4em',
              margin: '0',
              fontSize: '85%',
              borderRadius: '0.3em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            }
          },
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
