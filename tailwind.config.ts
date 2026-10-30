import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#132B45', // P-20
          foreground: '#FFFFFF', // P-100
          container: '#E1EDFB', // P-80
          'on-container': '#17365D', // P-30
        },
        express: {
          DEFAULT: '#2563EB', // Service Express / 50
          foreground: '#FFFFFF', // On Express / 100
          container: '#EFF6FF',
          'on-container': '#1D4ED8',
        },
        intercity: {
          DEFAULT: '#059669', // Service Intercity / 50
          foreground: '#FFFFFF', // On Intercity / 100
          container: '#ECFDF5',
          'on-container': '#047857',
        },
        error: {
          DEFAULT: '#DC2626', // E-40
          foreground: '#FFFFFF', // E-100
          container: '#FEE2E2', // E-90
          'on-container': '#991B1B', // E-30
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
          container: '#FEF3C7',
          'on-container': '#B45309',
        },
        ai: {
          primary: '#6366F1',
          container: '#F5F3FF',
          'on-container': '#4F46E5',
          border: '#DDD6FE',
        },
        surface: {
          dim: '#D9E2EC', // N-85
          bright: '#F8FAFC', // N-97
          'container-lowest': '#FFFFFF', // N-100
          'container-low': '#F4F6F9', // N-96
          container: '#EEF2F6', // N-94
          'container-high': '#E2E8F0', // N-92
          'container-highest': '#D8DFE8', // N-90
          'on-surface': '#0F172A', // N-10
          'on-variant': '#334155', // N-30
          outline: '#64748B', // N-50
          'outline-variant': '#CBD5E1', // N-80
        },
      },
    },
  },
  plugins: [],
};

export default config;
