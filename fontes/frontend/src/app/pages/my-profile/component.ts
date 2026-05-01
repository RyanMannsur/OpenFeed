import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ArticleService } from '../../services/article/service';
import { DummyArticle, ArticleCardAction } from '../../shared/types/article';
import { DateUtil } from '../../shared/utils/date.util';

import { ArticleCardComponent } from '../../components/article-card/component';
import { PaginationComponent } from '../../components/pagination/component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ArticleCardComponent,
    PaginationComponent
  ],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class MyProfileComponent implements OnInit {
  articles: DummyArticle[] = [];
  
  currentPage: number = 1;
  pageSize: number = 2;
  totalItems: number = 0;

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  loadArticles() {
    this.articleService.getArticles(this.currentPage, this.pageSize, {}).subscribe(result => {
      this.articles = result.data;
      this.totalItems = result.total;
      this.cdr.markForCheck();
    });
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

  onCreateNewArticle() {
    void this.router.navigate(['/testComponents']);
  }

  onGoBack() {
    void this.router.navigate(['/home']);
  }

  onSettingsClick() {
    void this.router.navigate(['/testComponents']);
  }
}
