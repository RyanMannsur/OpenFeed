import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DummyArticle } from '../../shared/types/article';

export interface ArticleFilter {
  search?: string;
  category?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(page: number, size: number, filter?: ArticleFilter): Observable<PaginatedResult<DummyArticle>> {
    return this.http.get<DummyArticle[]>('/mocks/articles.json').pipe(
      map(articles => {
        let filteredArticles = articles;

        if (filter) {
          if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            filteredArticles = filteredArticles.filter(a => 
              a.title.toLowerCase().includes(searchLower) || 
              a.author.toLowerCase().includes(searchLower)
            );
          }
          if (filter.category) {
            filteredArticles = filteredArticles.filter(a => a.category === filter.category);
          }
          if (filter.minRating !== undefined) {
            filteredArticles = filteredArticles.filter(a => a.rating >= filter.minRating!);
          }
          if (filter.maxRating !== undefined) {
            filteredArticles = filteredArticles.filter(a => a.rating <= filter.maxRating!);
          }
          if (filter.startDate) {
            const start = new Date(filter.startDate).getTime();
            filteredArticles = filteredArticles.filter(a => new Date(a.date).getTime() >= start);
          }
          if (filter.endDate) {
            const end = new Date(filter.endDate);
            end.setHours(23, 59, 59, 999);
            filteredArticles = filteredArticles.filter(a => new Date(a.date).getTime() <= end.getTime());
          }
        }

        const total = filteredArticles.length;
        const startIndex = (page - 1) * size;
        const data = filteredArticles.slice(startIndex, startIndex + size);

        return { data, total };
      })
    );
  }

  getCategories(): Observable<{label: string, value: string}[]> {
    return this.http.get<DummyArticle[]>('/mocks/articles.json').pipe(
      map(articles => {
        const categories = new Set(articles.map(a => a.category));
        return Array.from(categories).map(c => ({ label: c, value: c }));
      })
    );
  }
}
