import { fetchArticles } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import CategoryFilter from '@/components/CategoryFilter';
import SourceFilter from '@/components/SourceFilter';
import SearchBar from '@/components/SearchBar';
import DateFilter from '@/components/DateFilter';
import { cookies } from 'next/headers';
import { LocalStorageKeys } from '@/lib/types';

type HomeProps = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    source?: string;
    q?: string;
    date?: string;
  }>
}

export default async function Home(props: HomeProps) {
  const searchParams = await props.searchParams || {};
  const { page = 1, category, source, q, date } = searchParams;
  const currentPage = Number(page) || 1;

  let token: string | undefined = undefined;
  if (typeof window === 'undefined') {
    const cookieStore = await cookies();
    token = cookieStore.get(LocalStorageKeys.Token)?.value;
  }

  const articlesRes = await fetchArticles({
    per_page: 21,
    page: currentPage,
    category: category || undefined,
    source: source || undefined,
    q: q || undefined,
    date: date || undefined
  }, token);

  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams(Object.entries(searchParams));
    params.set('page', pageNum.toString());
    return `/?${params.toString()}`;
  };

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

export const metadata = {
  title: 'Home - News Hub',
  description: 'Stay updated with the latest news from your favorite sources, categories, and authors. Personalize your news experience with News Hub.',
  alternates: {
    canonical: '/',
  },
};
