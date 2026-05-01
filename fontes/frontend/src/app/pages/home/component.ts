import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleService, ArticleFilter } from '../../services/article/service';
import { DummyArticle, ArticleCardAction } from '../../shared/types/article';
import { DateUtil } from '../../shared/utils/date.util';

import { ArticleCardComponent } from '../../components/article-card/component';
import { RangeSliderComponent } from '../../components/range-slider/component';
import { InputComponent } from '../../components/input/component';
import { SelectComponent } from '../../components/select/component';
import { ButtonComponent } from '../../components/button/component';
import { PaginationComponent } from '../../components/pagination/component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ArticleCardComponent,
    RangeSliderComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    PaginationComponent
  ],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class HomeComponent implements OnInit {
  articles: DummyArticle[] = [];
  categories: {label: string, value: string}[] = [];
  
  currentPage: number = 1;
  pageSize: number = 4;
  totalItems: number = 0;
  
  filters: ArticleFilter = {};
  filterRating: {min: number, max: number} = {min: 1, max: 5};
  filterSearch: string = '';
  filterCategory: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';

  constructor(private articleService: ArticleService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategories();
    this.loadArticles();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  loadCategories() {
    this.articleService.getCategories().subscribe(cats => {
      setTimeout(() => {
        this.categories = [{label: 'Todas', value: ''}, ...cats];
        this.cdr.markForCheck();
      });
    });
  }

  loadArticles() {
    this.articleService.getArticles(this.currentPage, this.pageSize, this.filters).subscribe(result => {
      this.articles = result.data;
      this.totalItems = result.total;
      this.cdr.markForCheck();
    });
  }

  applyFilters() {
    this.filters = {
      search: this.filterSearch,
      category: this.filterCategory,
      minRating: this.filterRating.min,
      maxRating: this.filterRating.max,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate
    };
    this.currentPage = 1;
    this.loadArticles();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadArticles();
  }

  formatDate(dateStr: string): string {
    return DateUtil.formatRelativeTime(dateStr);
  }

  onArticleAction(action: ArticleCardAction, article: DummyArticle) {
    console.log(`Action ${action.id} clicked on article: ${article.title}`);
  }
}
