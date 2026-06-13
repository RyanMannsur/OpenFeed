import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { InputComponent } from '../../components/input/component';
import { SelectComponent } from '../../components/select/component';
import { ButtonComponent } from '../../components/button/component';
import { ModalComponent } from '../../components/modal/component';
import { ToastService } from '../../core/services/toast.service';
import { ArticleService } from '../../services/article/service';

@Component({
  selector: 'app-article-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ModalComponent
  ],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ArticleCreateComponent {
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
    private location: Location,
    private toastService: ToastService
  ) {}

  onGoBack() {
    this.location.back();
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
    if (this.isPublishing) {
      return;
    }

    if (!this.title.trim() || !this.content.trim() || !this.category.trim()) {
      this.toastService.showError('Preencha título, conteúdo e categoria antes de publicar.');
      return;
    }

    this.isPublishing = true;
    this.publishError = '';

    try {
      let imageUrl: string | undefined;

      if (this.imageFile) {
        imageUrl = await firstValueFrom(this.articleService.uploadArticleImage(this.imageFile));
      }

      await firstValueFrom(this.articleService.createArticle({
        title: this.title,
        content: this.content,
        category: this.category,
        imageUrl
      }));

      this.toastService.showSuccess('Artigo publicado com sucesso!');
      this.isPublishModalOpen = false;
      await this.router.navigate(['/home']);
    } catch (error) {
      this.publishError = this.extractErrorMessage(error, 'Não foi possível publicar o artigo.');
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
}
