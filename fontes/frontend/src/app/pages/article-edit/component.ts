import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { InputComponent } from '../../components/input/component';
import { SelectComponent } from '../../components/select/component';
import { ButtonComponent } from '../../components/button/component';
import { ModalComponent } from '../../components/modal/component';
import { ToastService } from '../../core/services/toast.service';
import { ArticleService } from '../../services/article/service';

@Component({
  selector: 'app-article-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent,
    ModalComponent
  ],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ArticleEditComponent implements OnInit {
  articleId: number | null = null;
  isLoading: boolean = true;
  loadError: string = '';
  title: string = '';
  content: string = '';
  category: string = '';
  imageFile: File | null = null;
  imagePreviewUrl: string = '';
  isPublishing: boolean = false;
  publishError: string = '';

  categories = [
    { label: 'Tecnologia', value: 'tech' },
    { label: 'Esportes', value: 'sports' },
    { label: 'Política', value: 'politics' },
    { label: 'Entretenimento', value: 'entertainment' }
  ];

  isPublishModalOpen: boolean = false;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.isLoading = false;
      this.loadError = 'Artigo inválido.';
      this.toastService.showError('Artigo inválido.');
      void this.router.navigate(['/home']);
      return;
    }

    this.articleId = id;
    this.loadArticle();
  }

  onGoBack() {
    this.location.back();
  }

  loadArticle() {
    if (!this.articleId) {
      return;
    }

    this.isLoading = true;
    this.loadError = '';

    this.articleService.getArticleById(this.articleId).subscribe({
      next: (article) => {
        this.isLoading = false;
        this.title = article.title ?? '';
        this.content = article.content ?? '';
        this.category = this.normalizeCategoryValue(article.category);
        this.imagePreviewUrl = article.imageUrl || '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.loadError = 'Não foi possível carregar o artigo.';
        this.toastService.showError(this.loadError);
        this.cdr.detectChanges();
        void this.router.navigate(['/home']);
      }
    });
  }

  onImageClick(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    this.imageFile = file;

    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }

    this.imagePreviewUrl = URL.createObjectURL(file);
  }

  openPublishModal() {
    this.isPublishModalOpen = true;
  }

  closePublishModal() {
    this.isPublishModalOpen = false;
  }

  async confirmPublish() {
    if (!this.articleId || this.isPublishing) {
      return;
    }

    if (!this.title.trim() || !this.content.trim()) {
      this.toastService.showError('Preencha título e conteúdo antes de salvar.');
      return;
    }

    this.isPublishing = true;
    this.publishError = '';

    try {
      await firstValueFrom(this.articleService.updateArticle(this.articleId, {
        title: this.title,
        content: this.content
      }));

      this.toastService.showSuccess('Artigo atualizado com sucesso!');
      this.isPublishModalOpen = false;
      await this.router.navigate(['/home']);
    } catch (error) {
      this.publishError = this.extractErrorMessage(error, 'Não foi possível atualizar o artigo.');
      this.toastService.showError(this.publishError);
      console.error(error);
    } finally {
      this.isPublishing = false;
    }
  }

  private extractErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const responseError = (error as { error?: { message?: string } }).error;
      if (responseError?.message) {
        return responseError.message;
      }
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  }

  normalizeCategoryValue(category: string): string {
    const normalized = category?.toLowerCase?.() ?? '';

    const categoryMap: Record<string, string> = {
      tecnologia: 'tech',
      tech: 'tech',
      esportes: 'sports',
      sports: 'sports',
      política: 'politics',
      politica: 'politics',
      politics: 'politics',
      entretenimento: 'entertainment',
      entertainment: 'entertainment'
    };

    return categoryMap[normalized] ?? normalized;
  }
}
