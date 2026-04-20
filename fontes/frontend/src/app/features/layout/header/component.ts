import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class HeaderComponent {
  userClicked() {
    console.log('User icon clicked');
  }

  logoutClicked() {
    console.log('Logout icon clicked');
  }
}
