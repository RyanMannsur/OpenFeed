import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ButtonComponent } from '../../components/button/component';
import { FormComponent } from '../../components/form/component';
import { InputComponent } from '../../components/input/component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, FormComponent, InputComponent],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  isSubmitting = false;
  errorMessage = '';

  handleRegister(): void {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'A senha e a confirmação precisam ser iguais.';
      return;
    }

    this.isSubmitting = true;

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isSubmitting = false;

        void this.router.navigate(['/login'], {
          queryParams: { registered: this.email }
        });
      },
      error: (error: Error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Não foi possível criar o cadastro.';
      }
    });
  }
}