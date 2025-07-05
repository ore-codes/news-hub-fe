"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import CategoryFilter from '@/components/CategoryFilter';
import SourceFilter from '@/components/SourceFilter';
import SearchBar from '@/components/SearchBar';
import DateFilter from '@/components/DateFilter';
import { Icon } from '@iconify/react';
import { useSearchParams } from 'next/navigation';

export default function ArticleListing() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';
  const category = searchParams.get('category') || undefined;
  const source = searchParams.get('source') || undefined;
  const q = searchParams.get('q') || undefined;
  const date = searchParams.get('date') || undefined;
  const currentPage = Number(page) || 1;

  const { data: articlesRes, isLoading, error } = useQuery({
    queryKey: ['articles', currentPage, category, source, q, date],
    queryFn: () => fetchArticles({
      per_page: 21,
      page: currentPage,
      category,
      source,
      q,
      date
    }),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams([...searchParams.entries()]);
    params.set('page', pageNum.toString());
    return `/?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Icon icon="icon-park-outline:loading" className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Icon icon="icon-park-outline:warning" className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600">Failed to load articles. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!articlesRes) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Icon icon="icon-park-outline:warning" className="w-8 h-8 mx-auto mb-4 text-yellow-500" />
          <p>No articles found.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <CategoryFilter />
      <SourceFilter />
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 w-full">
        <div className="flex-1 w-full">
          <SearchBar />
        </div>
        <div className="w-full md:w-auto">
          <DateFilter />
        </div>
      </div>
      <div className="grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {articlesRes.data.map((article: any) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <div className="flex justify-center items-center space-x-2 mt-6">
        {articlesRes.current_page > 1 && (
          <Link
            href={createPageUrl(articlesRes.current_page - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:brightness-90"
          >
            Previous
          </Link>
        )}
        <span className="px-2">Page {articlesRes.current_page} of {articlesRes.last_page}</span>
        {articlesRes.current_page < articlesRes.last_page && (
          <Link
            href={createPageUrl(articlesRes.current_page + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:brightness-90"
          >
            Next
          </Link>
        )}
      </div>
    </main>
  );
}
