import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RatingComponent } from '../../components/rating/component';
import { ArticleService } from '../../services/article/service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-article-read',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RatingComponent
  ],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ArticleReadComponent implements OnInit {
  isLoading = true;
  loadError = '';
  articleId: number = 0;
  
  article = {
    author: '',
    title: '',
    content: '',
    imageUrl: '',
    summary: '',
    date: '',
    rating: 0
  };

  userRating = 0;
  isRated = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(this.articleId)) {
      this.isLoading = false;
      this.loadError = 'Artigo inválido.';
      return;
    }

    this.loadArticle();
  }

  loadArticle() {
    this.isLoading = true;
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (article) => {
        this.article = {
          author: article.author ?? '',
          title: article.title ?? '',
          content: article.content ?? '',
          imageUrl: article.imageUrl || '',
          summary: article.summary ?? '',
          date: article.date ?? '',
          rating: Number(article.rating ?? 0)
        };

        // Carrega a avaliação do usuário logado para este artigo
        this.articleService.getArticleRating(this.articleId).subscribe({
          next: (ratingInfo) => {
            this.isLoading = false;
            if (ratingInfo.tipo === 'propria') {
              this.userRating = ratingInfo.valor;
              this.isRated = true;
            } else {
              this.userRating = 0;
              this.isRated = false;
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erro ao buscar avaliação do usuário:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.loadError = 'Não foi possível carregar o artigo.';
        this.cdr.detectChanges();
      }
    });
  }

  onGoBack() {
    this.location.back();
  }

  onRatingChange(newRating: number) {
    if (this.isRated || newRating === 0) return;

    this.articleService.rateArticle(this.articleId, newRating).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message || 'Avaliação registrada com sucesso!');
        this.isRated = true;
        this.userRating = newRating;
        
        // Recarregar os detalhes do artigo em segundo plano para obter a média atualizada
        this.articleService.getArticleById(this.articleId).subscribe({
          next: (updatedArticle) => {
            this.article.rating = Number(updatedArticle.rating ?? 0);
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.toastService.showError(err?.error?.message || 'Não foi possível enviar a avaliação.');
      }
    });
  }
}
