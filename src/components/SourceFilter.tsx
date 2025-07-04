'use client';

import { fetchSources } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SourceFilter() {
  const searchParams = useSearchParams();
  const currentSource = searchParams.get('source');
  const currentCategory = searchParams.get('category');

  const query = useQuery({
    queryKey: ['sources'],
    queryFn: fetchSources,
  });

  const createSourceUrl = (source: string) => {
    const params = new URLSearchParams();
    if (source !== 'all') {
      params.set('source', source);
    }

    if (currentCategory) {
      params.set('category', currentCategory);
    }
    params.set('page', '1');
    return `/?${params.toString()}`;
  };

  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
        <Link
          href={createSourceUrl('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${!currentSource
            ? 'bg-neutral-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          All Sources
        </Link>
        {query.data?.map(source => {
          const sourceName = source.split('/').pop() || source;
          const isActive = currentSource === source;

          return (
            <Link
              key={source}
              href={createSourceUrl(source)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${isActive
                ? 'bg-neutral-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {sourceName}
            </Link>
          );
        })}
      </div>
    </div>
  );
} 