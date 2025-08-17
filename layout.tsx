import './globals.css';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alpha Drive Marketplace',
  description: 'מרקטפלייס לרכבי הדרכה ואביזרים עבור מורי נהיגה בישראל',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen flex flex-col bg-secondary text-white">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}