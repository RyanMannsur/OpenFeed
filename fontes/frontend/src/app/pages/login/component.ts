import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom, take, timeout } from 'rxjs';

import { ButtonComponent } from '../../components/button/component';
import { FormComponent } from '../../components/form/component';
import { InputComponent } from '../../components/input/component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, FormComponent, InputComponent],
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  email = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    if (this.authService.getCurrentUser()) {
      void this.router.navigate(['/testComponents']);
      return;
    }

    const registeredEmail = this.route.snapshot.queryParamMap.get('registered');

    if (registeredEmail) {
      this.email = registeredEmail;
      this.successMessage = 'Conta criada com sucesso. Faça login para continuar.';
    }
  }

  async handleLogin(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    try {
      await firstValueFrom(
        this.authService.login({ email: this.email, password: this.password }).pipe(
          take(1),
          timeout(5000)
        )
      );

      await this.router.navigate(['/testComponents']);
    } catch {
      this.errorMessage = 'E-mail ou senha incorretos.';
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }
}