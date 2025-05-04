import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private apiUrl = `${environment.apiUrl}/auth/forgot-password`;
  private lastEmail: string = '';

  constructor(private http: HttpClient) {}
 
  sendResetPasswordEmail(email: string): Observable<any> {
    this.lastEmail = email; 
    return this.http.post<any>(this.apiUrl, { email });
  }

    getLastEmail(): string {
      return this.lastEmail;
    }
    
    resendResetPasswordEmail(): Observable<any> {
      if (!this.lastEmail) {
        throw new Error('Aucune adresse email précédente');
      }
      return this.http.post<any>(this.apiUrl, { email: this.lastEmail });
    }
}