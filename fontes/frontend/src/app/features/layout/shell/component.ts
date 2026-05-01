import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/component';
import { ToastComponent } from '../../../components/toast/component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ShellComponent {
}
