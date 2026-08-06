import type { Metadata } from 'next';
import { Newsreader, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../src/context/AuthContext';
import { isSupabaseConfigured } from '../src/lib/supabase';
import { ConfigError } from '../src/components/ui';

const newsreader = Newsreader({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-newsreader' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-plex-mono' });
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'WAAW — Invest in Black-founded startups',
  description: 'Browse verified Black-founded startups, commit capital through protected escrow, and register your own startup to raise.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${plexMono.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-tx antialiased">
        {isSupabaseConfigured ? <AuthProvider>{children}</AuthProvider> : <ConfigError />}
      </body>
    </html>
  );
}
