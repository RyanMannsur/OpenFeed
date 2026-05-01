import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ArticleService } from '../../services/article/service';
import { DummyArticle, ArticleCardAction } from '../../shared/types/article';
import { DateUtil } from '../../shared/utils/date.util';
import { ToastService } from '../../core/services/toast.service';

import { ArticleCardComponent } from '../../components/article-card/component';
import { PaginationComponent } from '../../components/pagination/component';
import { RatingComponent } from '../../components/rating/component';
import { InputComponent } from '../../components/input/component';
import { ButtonComponent } from '../../components/button/component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ArticleCardComponent,
    PaginationComponent,
    RatingComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class UserProfileComponent implements OnInit {
  isCurrentUser: boolean = false;
  isEditingAbout: boolean = false;
  tempAbout: string = '';
  
  user = {
    name: 'Nome do Usuário',
    about: 'Este é um texto sobre o usuário. Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui international first-class nulla ut. Punctual adipisicing, essential lovely queen tempor eiusmod irure.',
    photoUrl: '/img/placeholder-image.jpg',
    rating: 4
  };

  articles: DummyArticle[] = [];
  currentPage: number = 1;
  pageSize: number = 2;
  totalItems: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.url.subscribe(segments => {
      this.isCurrentUser = segments[0]?.path === 'my-user';
      this.loadUserData();
      this.loadArticles();
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  loadUserData() {
    if (this.isCurrentUser) {
      this.user.name = 'Meu Usuário';
    } else {
      this.user.name = 'Usuário Visitado';
    }
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

  onGoBack() {
    this.location.back();
  }

  onEditPhoto() {
    if (!this.isCurrentUser) return;
    this.toastService.showInfo('Funcionalidade de alterar foto simulada!');
  }

  onEditAbout() {
    if (!this.isCurrentUser) return;
    this.isEditingAbout = true;
    this.tempAbout = this.user.about;
  }

  onSaveAbout() {
    this.user.about = this.tempAbout;
    this.isEditingAbout = false;
    this.toastService.showSuccess('Sobre atualizado com sucesso!');
  }

  onCancelAbout() {
    this.isEditingAbout = false;
  }

  onCardClick(article: DummyArticle) {
    void this.router.navigate(['/article-read/1']);
  }

  onArticleAction(action: ArticleCardAction, article: DummyArticle) {
    if (action.id === 'edit') {
      void this.router.navigate(['/article-edit/1']);
    }
  }
}
