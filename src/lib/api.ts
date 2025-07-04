import axios from 'axios';
import { Article, Paginated } from './types';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
  }
});

export async function fetchArticles(params: {
  q?: string;
  category?: string;
  source?: string;
  date?: string;
  per_page?: number;
  page?: number;
}) {
  const res = await api.get<Paginated<Article>>('/articles', { params });
  return res.data;
}

export async function fetchCategories() {
  const res = await api.get<{ categories: string[] }>('/categories');
  return res.data?.categories;
}

export async function fetchSources() {
  const res = await api.get<{ sources: string[] }>('/sources');
  return res.data?.sources;
}
