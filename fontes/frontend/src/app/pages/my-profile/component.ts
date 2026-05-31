import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ArticleService } from '../../services/article/service';
import { DummyArticle, ArticleCardAction } from '../../shared/types/article';
import { DateUtil } from '../../shared/utils/date.util';
import { ToastService } from '../../core/services/toast.service';

import { ArticleCardComponent } from '../../components/article-card/component';
import { PaginationComponent } from '../../components/pagination/component';
import { ModalComponent } from '../../components/modal/component';
import { ButtonComponent } from '../../components/button/component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ArticleCardComponent,
    PaginationComponent,
    ModalComponent,
    ButtonComponent
  ],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class MyProfileComponent implements OnInit {
  articles: DummyArticle[] = [];

  currentPage: number = 1;
  pageSize: number = 2;
  totalItems: number = 0;

  isDeleteModalOpen: boolean = false;
  isDeleting: boolean = false;
  deleteError: string = '';
  articleToDelete: DummyArticle | null = null;

  constructor(
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadArticles();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  loadArticles() {
    this.articleService.getMyArticles(this.currentPage, this.pageSize).subscribe(result => {
      this.articles = result.data.map((article) => ({
        ...article,
        actions: [
          { id: 'edit', label: 'Editar', icon: 'edit' },
          { id: 'delete', label: 'Excluir', icon: 'delete', danger: true }
        ]
      }));
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
    if (action.id === 'edit') {
      void this.router.navigate([`/article-edit/${article.id}`]);
    } else if (action.id === 'delete') {
      this.articleToDelete = article;
      this.isDeleteModalOpen = true;
      this.deleteError = '';
    }
  }

  closeDeleteModal() {
    if (this.isDeleting) {
      return;
    }
    this.isDeleteModalOpen = false;
    this.articleToDelete = null;
    this.deleteError = '';
  }

  confirmDelete() {
    if (!this.articleToDelete?.id || this.isDeleting) {
      return;
    }

    this.isDeleting = true;

    this.articleService.deleteArticle(this.articleToDelete.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Artigo excluído com sucesso!');
        this.isDeleteModalOpen = false;
        this.articleToDelete = null;
        this.deleteError = '';
        this.isDeleting = false;

        // Se era o único item da página, volta para a anterior
        if (this.articles.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }

        this.loadArticles();
      },
      error: (error) => {
        console.error(error);
        this.isDeleting = false;
        const msg = error?.error?.message ?? 'Não foi possível excluir o artigo.';
        this.deleteError = msg;
        this.toastService.showError(msg);
      }
    });
  }

  onCreateNewArticle() {
    void this.router.navigate(['/article-create']);
  }

  onGoBack() {
    void this.router.navigate(['/home']);
  }

  onSettingsClick() {
    void this.router.navigate(['/my-user']);
  }

  onCardClick(article: DummyArticle) {
    void this.router.navigate([`/article-read/${article.id}`]);
  }

  onAuthorClick(article: DummyArticle) {
    void this.router.navigate([`/user/${article.authorId ?? 1}`]);
  }
}
