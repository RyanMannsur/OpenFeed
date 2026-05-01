import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { InputComponent } from '../../components/input/component';
import { SelectComponent } from '../../components/select/component';
import { ButtonComponent } from '../../components/button/component';
import { ModalComponent } from '../../components/modal/component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-article-edit',
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
export class ArticleEditComponent implements OnInit {
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
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Simular carregamento de dados do artigo
    this.title = 'Artigo Mockado para Edição';
    this.content = 'Este é o conteúdo mockado do artigo que estamos editando. Imagine que ele foi carregado do backend ao acessar a página.';
    this.category = 'tech';
  }

  onGoBack() {
    this.location.back();
  }

  onImageClick() {
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
    this.toastService.showSuccess('Artigo atualizado com sucesso!');
    console.log('Artigo editado:', { title: this.title, content: this.content, category: this.category });
    void this.router.navigate(['/home']);
  }
}
