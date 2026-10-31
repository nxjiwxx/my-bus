import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Tailwind v3 에 없는 유틸리티(코드 전반에서 사용 중)를 정의해 디자인 의도를 복원
      boxShadow: {
        '2xs': '0 1px 0 0 rgb(15 23 42 / 0.05)',
        xs: '0 1px 2px 0 rgb(15 23 42 / 0.06)',
      },
      scale: {
        '98': '0.98',
        '99': '0.99',
      },
      transitionDuration: {
        '280': '280ms',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '13': '3.25rem',
      },
      // 타이포그래피 스케일 (Display 30~28 / Headline 24~22 / Title 20~18 / Body 16~15 / Label 14~13 / Caption 12~10)
      fontSize: {
        display: ['30px', { lineHeight: '1.25' }],
        'display-sm': ['28px', { lineHeight: '1.25' }],
        headline: ['24px', { lineHeight: '1.3' }],
        'headline-sm': ['22px', { lineHeight: '1.3' }],
        title: ['20px', { lineHeight: '1.35' }],
        'title-sm': ['18px', { lineHeight: '1.4' }],
        body: ['16px', { lineHeight: '1.5' }],
        'body-sm': ['15px', { lineHeight: '1.5' }],
        label: ['14px', { lineHeight: '1.45' }],
        'label-sm': ['13px', { lineHeight: '1.45' }],
        caption: ['12px', { lineHeight: '1.4' }],
        'caption-sm': ['11px', { lineHeight: '1.4' }],
        'caption-xs': ['10px', { lineHeight: '1.4' }],
      },
      // 레이어 순서 (헤더/내비 < 페이지 < 시트 < 다이얼로그 < 토스트 < 개발자 도구)
      zIndex: {
        header: '30',
        nav: '30',
        page: '40',
        sheet: '50',
        dialog: '60',
        toast: '70',
        dev: '80',
      },
      colors: {
        primary: {
          DEFAULT: '#132B45', // P-20
          foreground: '#FFFFFF', // P-100
          container: '#E1EDFB', // P-80
          'on-container': '#17365D', // P-30
          hover: '#1E3A8A',
        },
        express: {
          DEFAULT: '#2563EB', // Service Express / 50
          foreground: '#FFFFFF', // On Express / 100
          container: '#EFF6FF',
          'on-container': '#1D4ED8',
          border: '#BFDBFE',
          soft: '#DBEAFE',
        },
        intercity: {
          DEFAULT: '#059669', // Service Intercity / 50
          foreground: '#FFFFFF', // On Intercity / 100
          container: '#ECFDF5',
          'on-container': '#047857',
          border: '#A7F3D0',
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
          muted: '#94A3B8', // 비활성/플레이스홀더 전용 (본문 정보에는 outline 사용)
          subtle: '#475569',
          soft: '#F1F5F9',
          'outline-variant': '#CBD5E1', // N-80
        },
      },
    },
  },
  plugins: [],
};

export default config;
