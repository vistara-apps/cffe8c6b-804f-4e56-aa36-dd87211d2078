import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cravelocal.vercel.app'),
  title: 'CraveLocal - Discover Your Next Favorite Restaurant',
  description: 'Find hyper-local, mood-based restaurants tailored to your cravings',
  openGraph: {
    title: 'CraveLocal',
    description: 'Discover your next favorite local restaurant, tailored to your mood',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
