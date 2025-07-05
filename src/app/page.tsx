import ArticleListing from '@/components/ArticleListing';
import { Icon } from '@iconify/react';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News Hub - Latest News and Articles',
  description: 'Stay informed with the latest news, articles, and updates from trusted sources. Browse by category, source, or search for specific topics.',
  keywords: 'news, articles, latest news, current events, journalism, media',
  openGraph: {
    title: 'News Hub - Latest News and Articles',
    description: 'Stay informed with the latest news, articles, and updates from trusted sources.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    title: 'News Hub - Latest News and Articles',
    description: 'Stay informed with the latest news, articles, and updates from trusted sources.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Icon icon="icon-park-outline:loading" className="w-8 h-8 mx-auto mb-4 animate-spin" />
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ArticleListing />
    </Suspense>
  );
}
