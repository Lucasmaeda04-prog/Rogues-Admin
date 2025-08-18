import type { Config } from 'tailwindcss';
import { colors } from './src/lib/color';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
      screens: { '3xl': '1680px' },
    },
  },
  plugins: [require('tailwindcss-animated')],
} satisfies Config;
