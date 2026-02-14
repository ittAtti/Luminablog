
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
}

export type Category = 'All' | 'Technology' | 'Lifestyle' | 'Design' | 'AI' | 'Health';
