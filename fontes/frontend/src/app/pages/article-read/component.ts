import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../../components/rating/component';

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
  article = {
    title: '',
    content: '',
    imageUrl: '',
    rating: 0
  };

  constructor(private location: Location) {}

  ngOnInit() {
    // Dados mockados para leitura
    this.article = {
      title: 'Título do Artigo Mockado',
      content: `Este é um artigo mockado. Ele possui parágrafos de exemplo para visualização.
      
      Mussum Ipsum, cacilds vidis litro abertis. Casamentiss faiz malandris se pirulitá. Interessantiss quisso pudia ce receita de bolis, mais bolis eu num gostis. Em pé sem cair, deitado sem dormir, sentado sem cochilar e fazendo pose.
      
      Quem manda na minha terra sou euzis! Suco de cevadiss deixa as pessoas mais interessantis. Copo furadis é disculpa de bebadis, arquiteto de teta. Praesent vel viverra nisi. Mauris aliquet nunc non turpis scelerisque, eget.`,
      imageUrl: '/img/placeholder-image.jpg', // Placeholder caso exista, no template colocaremos uma div cinza se não tiver foto
      rating: 4
    };
  }

  onGoBack() {
    this.location.back();
  }

  onRatingChange(newRating: number) {
    console.log(`Nova avaliação: ${newRating} estrelas`);
    this.article.rating = newRating;
  }
}
