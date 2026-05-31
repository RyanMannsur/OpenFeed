import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RatingComponent } from '../../components/rating/component';
import { ArticleService } from '../../services/article/service';

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
  article = {
    author: '',
    title: '',
    content: '',
    imageUrl: '',
    summary: '',
    date: '',
    rating: 0
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id)) {
      this.isLoading = false;
      this.loadError = 'Artigo inválido.';
      return;
    }

    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.isLoading = false;

        this.article = {
          author: article.author ?? '',
          title: article.title ?? '',
          content: article.content ?? '',
          imageUrl: article.imageUrl || '',
          summary: article.summary ?? '',
          date: article.date ?? '',
          rating: Number(article.rating ?? 0)
        };

        this.cdr.detectChanges();
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
    console.log(`Nova avaliação: ${newRating} estrelas`);
    this.article.rating = newRating;
  }
}
