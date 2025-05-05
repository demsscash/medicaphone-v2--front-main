import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Patient } from '../core/models/patient';
import { DecodedToken } from '../core/models/decodedToken';
import { User } from '../core/models/User';
import { AuthResponse } from '../core/models/authResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrls: Record<'Praticien' | 'Assistant(e)' | 'Patient', string> = {
    'Praticien': `${environment.apiUrl}/auth/loginMedecin`,
    'Assistant(e)': `${environment.apiUrl}/auth/loginAssistant`,
    'Patient': `${environment.apiUrl}/auth/loginPatient`
  };

  constructor(private http: HttpClient, private router: Router) { }

  login(userType: string, email: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    const apiUrl = this.apiUrls[userType as keyof typeof this.apiUrls];
    const body = { email, password, rememberMe };
    return this.http.post<AuthResponse>(apiUrl, body).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.getCurrentUser().subscribe((user: Patient) => {
            if (user.cabinetId) {
              localStorage.setItem('cabinetId', user.cabinetId.toString());
            }
          });
        }
      })
    );
  }

  // Nouvelle méthode pour l'inscription
  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, {
      email,
      password
    });
  }

  decodeToken(): DecodedToken | null {
    const token = localStorage.getItem('token');
    return token ? jwtDecode<DecodedToken>(token) : null;
  }

  getUserInfo(): DecodedToken | null {
    return this.decodeToken();
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<Patient> {
    return this.http.get<Patient>(`${environment.apiUrl}/auth/me`);
  }

  updateUser(userInfo: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/medecins`, userInfo);
  }
}