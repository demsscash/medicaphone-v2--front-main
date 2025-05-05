import { Component } from '@angular/core';
import { AuthService } from '../../authentication/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.password !== this.confirmPassword) {
      this.toastService.show('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (this.email && this.password) {
      // Ici, vous devrez implémenter la logique d'inscription réelle
      // Exemple simplifié pour l'instant
      this.authService.register(this.email, this.password).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
          this.toastService.show('Compte créé avec succès. Veuillez vous connecter.', 'success');
        },
        error: (error) => {
          this.toastService.show('Erreur lors de l\'inscription: ' + error.error, 'error');
        }
      });
    }
  }
}