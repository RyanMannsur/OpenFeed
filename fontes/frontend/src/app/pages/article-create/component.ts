import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InputComponent } from '../../components/input/component';
import { SelectComponent } from '../../components/select/component';
import { ButtonComponent } from '../../components/button/component';
import { ModalComponent } from '../../components/modal/component';
import { ToastService } from '../../core/services/toast.service';

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

  categories = [
    { label: 'Tecnologia', value: 'tech' },
    { label: 'Esportes', value: 'sports' },
    { label: 'Política', value: 'politics' },
    { label: 'Entretenimento', value: 'entertainment' }
  ];

  isPublishModalOpen: boolean = false;

  constructor(
    private router: Router, 
    private location: Location,
    private toastService: ToastService
  ) {}

  onGoBack() {
    this.location.back();
  }

  onImageClick() {
    // Simulando clique para envio de foto
    console.log('Selecionar foto clicado');
  }

  openPublishModal() {
    this.isPublishModalOpen = true;
  }

  closePublishModal() {
    this.isPublishModalOpen = false;
  }

  confirmPublish() {
    this.isPublishModalOpen = false;
    this.toastService.showSuccess('Artigo publicado com sucesso!');
    console.log('Artigo criado:', { title: this.title, content: this.content, category: this.category });
    void this.router.navigate(['/home']);
  }
}
