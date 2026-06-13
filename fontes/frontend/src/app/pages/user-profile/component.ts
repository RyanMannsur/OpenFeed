import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ArticleService } from '../../services/article/service';
import { AuthService } from '../../core/services/auth.service';
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
    private authService: AuthService,
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
      this.articleService.getUserProfile().subscribe({
        next: (profile) => {
          this.user.name = profile.nome ?? 'Meu Usuário';
          this.user.about = profile.bio ?? 'Sem biografia ainda.';
          this.user.rating = Number(profile.media_nota ?? 0);
          this.user.photoUrl = profile.avatar_url ? this.resolveImageUrl(profile.avatar_url) : '/img/placeholder-image.jpg';
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.user.name = this.authService.getCurrentUser()?.name ?? 'Meu Usuário';
        }
      });
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (Number.isFinite(id)) {
        this.articleService.getPublicUserProfile(id).subscribe({
          next: (profile) => {
            this.user.name = profile.nome ?? 'Usuário Visitado';
            this.user.about = profile.bio ?? 'Sem biografia ainda.';
            this.user.rating = Number(profile.media_nota ?? 0);
            this.user.photoUrl = profile.avatar_url ? this.resolveImageUrl(profile.avatar_url) : '/img/placeholder-image.jpg';
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    }
  }

  private resolveImageUrl(imageUrl: string): string {
    if (!imageUrl) return '/img/placeholder-image.jpg';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    return `http://localhost:3000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }

  loadArticles() {
    const source$ = this.isCurrentUser
      ? this.articleService.getMyArticles(this.currentPage, this.pageSize)
      : this.articleService.getArticles(this.currentPage, this.pageSize, {});

    source$.subscribe(result => {
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
    void this.router.navigate([`/article-read/${article.id}`]);
  }

  onArticleAction(action: ArticleCardAction, article: DummyArticle) {
    if (action.id === 'edit') {
      void this.router.navigate([`/article-edit/${article.id}`]);
    }
  }
}
