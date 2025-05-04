import { Component } from '@angular/core';
import { AuthService } from '../../authentication/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { DecodedToken } from '../../core/models/decodedToken';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean=false;
  selectedUserType: string = 'Praticien';
  showPassword: boolean = false;
  jwtdecode: DecodedToken | null = null;
  constructor(private authService: AuthService,private patientService: PatientService, private router: Router, private toastService: ToastService) {
    
  }

  selectUserType(type: string) {
    this.selectedUserType = type;
  }
  

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log("Form submitted");
    console.log("Username:", this.email);
    console.log("Password:", this.password);
    
    this.authService.login(this.selectedUserType,this.email, this.password, this.rememberMe).subscribe({
      next: (response) => {
        console.log(response)
        console.log('Login réussi', response);
        this.jwtdecode = this.authService.getUserInfo() as DecodedToken;

        this.router.navigate(['/home']);
        
        this.toastService.show('Login successful', 'success');
      },
      error: (error) => {
        console.error('Erreur de connexion', error);
        this.toastService.show(error.error, 'error');
      }
    });
  }
}