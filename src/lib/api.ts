import axios from 'axios';
import { Article, LocalStorageKeys, Paginated } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(LocalStorageKeys.Token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export async function fetchArticles(params: {
  q?: string;
  category?: string;
  source?: string;
  date?: string;
  per_page?: number;
  page?: number;
}, token?: string) {
  const config = token
    ? { params, headers: { Authorization: `Bearer ${token}` } }
    : { params };
  const res = await api.get<Paginated<Article>>('/articles', config);
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

export async function fetchAuthors() {
  const res = await api.get<{ authors: string[] }>('/authors');
  return res.data?.authors;
}

export async function login({ email, password }: { email: string; password: string }) {
  try {
    const res = await api.post('/login', { email, password });
    if (typeof window !== 'undefined' && res.data.token) {
      localStorage.setItem(LocalStorageKeys.Token, res.data.token);
    }
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw err.response.data;
    }
    throw err;
  }
}

export async function fetchMe() {
  const res = await api.get('/me');
  return res.data;
}

export async function logout() {
  try {
    await api.post('/logout');
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}

export async function register(dto: { name: string; email: string; password: string; password_confirmation: string }) {
  try {
    const res = await api.post('/register', dto);
    if (typeof window !== 'undefined' && res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw err.response.data;
    }
    throw err;
  }
}

export async function fetchPreferences() {
  const res = await api.get('/preferences');
  return res.data;
}

export async function updatePreferences(preferences: {
  sources?: string[];
  categories?: string[];
  authors?: string[];
}) {
  const res = await api.post('/preferences', preferences);
  return res.data;
}
