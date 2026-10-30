import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Bus - 천안종합버스터미널 AI 맞춤형 예매',
  description: '천안시 종합버스터미널 AI 기반 개인 맞춤형 이동 비서 및 고속·시외버스 스마트 예매 서비스',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#E2E8F0] text-[#0F172A] selection:bg-[#E1EDFB] selection:text-[#17365D]">
        {children}
      </body>
    </html>
  );
}
