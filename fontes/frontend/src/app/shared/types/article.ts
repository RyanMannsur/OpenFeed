export interface ArticleCardAction {
  id: string;
  label: string;
  icon?: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface DummyArticle {
  imageUrl: string;
  date: string;
  title: string;
  author: string;
  category: string;
  categoryIcon: string;
  rating: number;
  actions?: ArticleCardAction[];
}
