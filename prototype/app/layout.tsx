import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meridian Asset Management - ERM Prototype',
  description:
    'ERM / GRC Platform UX Reference Prototype — specification validation only. All data is fictional mock data.',
};

const themeBootstrap = `
try {
  if (localStorage.getItem('erm-prototype-theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
