import { Article } from '@/lib/types';
import { FC } from 'react';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="overflow-hidden flex flex-col md:flex-row border-r border-b border-neutral-200">
      {article.url_to_image && (
        <img
          src={article.url_to_image}
          alt={article.title}
          className="w-full md:w-48 h-48 object-cover rounded-lg shadow-lg"
        />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          <h2 className="text-xl font-semibold mb-2 hover:underline line-clamp-2">{article.title}</h2>
        </a>
        <div className="text-sm text-gray-500 mb-2">
          By {article.author} | {new Date(article.published_at).toLocaleDateString()}
        </div>
        <p className="text-gray-700 flex-1 line-clamp-3">{article.content}</p>
        <div className="mt-2">
          <span className="inline-block bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded">{article.category.split('/').pop()}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard; 