import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResetPasswordService } from '../../core/services/reset-password.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
 
@Component({
  selector: 'app-reset-password',
  standalone: true, // Si vous utilisez Angular 15+ avec standalone components
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  password = '';
  confirmPassword = '';
  token = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordTouched = false;
  showRequirements = false;
 
  constructor(
    private route: ActivatedRoute,
    private resetService: ResetPasswordService,
    private router: Router,
    private toastService: ToastService
  ) { }
 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        localStorage.setItem('token', this.token);
      }
    });
  }
 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
 
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
 
  checkPasswordValidity() {
    this.passwordTouched = true;
    this.showRequirements = !this.isPasswordValid(); // Afficher les exigences si le mot de passe n'est pas valide
  }
 
  isPasswordLengthValid(): boolean {
    return this.password.length >= 8 && this.password.length <= 12;
  }
 
  isPasswordCaseValid(): boolean {
    return /[A-Z]/.test(this.password) && /[a-z]/.test(this.password);
  }
 
  isPasswordDigitValid(): boolean {
    return /\d/.test(this.password);
  }
 
  isPasswordSpecialCharValid(): boolean {
    return /[@$!%*?&]/.test(this.password);
  }
 
  isPasswordValid(): boolean {
    return (
      this.isPasswordLengthValid() &&
      this.isPasswordCaseValid() &&
      this.isPasswordDigitValid() &&
      this.isPasswordSpecialCharValid()
    );
  }
 
  showingRequirements(): boolean {
    return this.showRequirements && !this.isPasswordValid();
  }
 
  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.toastService.show('Les mots de passe ne correspondent pas.', 'error');
      return;
    }
 
    if (!this.isPasswordValid()) {
      this.toastService.show('Le mot de passe ne respecte pas les critères de sécurité.', 'error');
      return;
    }
 
    this.resetService.resetPassword(this.password, this.confirmPassword)
      .subscribe({
        next: (response) => {
          this.toastService.show("Mot de passe réinitialisé avec succès", 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastService.show(err.error, 'error');
        }
      });
  }
}