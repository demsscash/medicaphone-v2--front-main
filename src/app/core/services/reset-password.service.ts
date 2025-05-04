import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) {}

  resetPassword(password: string, confirmPassword: string): Observable<string> {
    const body = { password, confirmPassword };
    return this.http.post<string>(`${environment.apiUrl}/auth/reset-password`, body,{ responseType: 'text' as 'json' });
  }
}
