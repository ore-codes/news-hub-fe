export type Paginated<T> = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: T[];
}

export type Article = {
  id: number;
  title: string;
  content: string;
  author: string;
  source: string;
  category: string;
  published_at: string;
  url: string;
  url_to_image: string;
};

export enum LocalStorageKeys {
  Token = 'token',
};

export enum QueryKeys {
  Me = 'me',
};
