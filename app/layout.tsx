import './globals.css';
import { Providers } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CraveLocal - Discover Your Next Favorite Local Restaurant',
  description: 'Find hyper-local, mood-based restaurants tailored to your cravings, vibe, and budget.',
  openGraph: {
    title: 'CraveLocal',
    description: 'Discover your next favorite local restaurant, tailored to your mood.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
