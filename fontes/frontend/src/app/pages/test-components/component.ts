import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '../../components/button/component';
import { InputComponent } from '../../components/input/component';
import { RatingComponent } from '../../components/rating/component';
import { PaginationComponent } from '../../components/pagination/component';
import { ModalComponent } from '../../components/modal/component';
import { FormComponent } from '../../components/form/component';
import { ArticleCardComponent } from '../../components/article-card/component';
import { ListComponent } from '../../components/list/component';
import { RangeSliderComponent } from '../../components/range-slider/component';
import { SelectComponent } from '../../components/select/component';

@Component({
  selector: 'app-test-components',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ButtonComponent,
    InputComponent,
    RatingComponent,
    PaginationComponent,
    ModalComponent,
    FormComponent,
    ArticleCardComponent,
    ListComponent,
    RangeSliderComponent,
    SelectComponent
  ],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class TestComponentsComponent {
  // Input vars
  textVal = '';
  passVal = '';
  selectVal = '';
  
  // Rating val
  ratingVal = 3;
  
  // Range val
  rangeVal = { min: 1, max: 5 };

  // Pagination
  currentPage = 1;

  // Modal
  isModalOpen = false;

  selectOptions = [
    { label: 'Esportes', value: 'esportes' },
    { label: 'Futebol', value: 'futebol' },
    { label: 'Filmes', value: 'filmes' },
    { label: 'Entretenimento', value: 'entretenimento' }
  ];

  dummyArticles = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600',
      timeText: 'Hoje às 08:20',
      title: 'Brasil ganha ouro em ótimo desempenho nas olimpíadas de inverno.',
      author: 'Usuario A',
      category: 'Esportes',
      categoryIcon: 'sports_soccer',
      rating: 4
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=600',
      timeText: 'Hoje às 08:19',
      title: 'Corinthians finaliza menos que outros classificados, mas Lázaro vê efetividade.',
      author: 'Usuario B',
      category: 'Futebol',
      categoryIcon: 'sports_soccer',
      rating: 3
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=600',
      timeText: 'Hoje às 08:23',
      title: 'Novo filme do Homem-Aranha lota os cinemas.',
      author: 'Usuario C',
      category: 'Filmes',
      categoryIcon: 'movie',
      rating: 5
    },
    {
      imageUrl: '', // test placeholder
      timeText: 'Ontem às 10:00',
      title: 'Morte de Odette Roitmann para o país.',
      author: 'Usuario D',
      category: 'Entretenimento',
      categoryIcon: 'tv',
      rating: 2
    }
  ];

  onPageChange(page: number) {
    this.currentPage = page;
  }

  submitTeste(event: Event) {
     console.log('Form submited', { text: this.textVal, pass: this.passVal });
     alert('Form enviado!');
  }
}
