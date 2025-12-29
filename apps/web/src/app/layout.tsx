import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Subsidize - Bermuda Grocery Price Comparison',
  description: 'Compare grocery prices across Bermuda stores and get delivery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
