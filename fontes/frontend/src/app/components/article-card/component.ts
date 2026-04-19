import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from '../rating/component';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ArticleCardComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() timeText: string = '';
  @Input() author: string = '';
  @Input() category: string = '';
  @Input() categoryIcon: string = '';
  @Input() rating: number = 0;
}
