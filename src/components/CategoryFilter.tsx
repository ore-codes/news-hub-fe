'use client';

import { fetchCategories } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CategoryFilter() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const currentSource = searchParams.get('source');

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createCategoryUrl = (category: string) => {
    const params = new URLSearchParams([...searchParams.entries()]);
    params.set('page', '1');
    if (category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    return `/?${params.toString()}`;
  };

  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
        <Link
          href={createCategoryUrl('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${!currentCategory
            ? 'bg-neutral-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          All
        </Link>
        {query.data?.map(category => {
          const categoryName = category.split('/').pop() || category;
          const isActive = currentCategory === category;

          return (
            <Link
              key={category}
              href={createCategoryUrl(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                ? 'bg-neutral-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {categoryName}
            </Link>
          );
        })}
      </div>
    </div>
  );
}