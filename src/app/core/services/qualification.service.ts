import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {
  
  private baseUrl = `${environment.apiUrl}/qualifications`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserQualifications(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/${userId}/qualifications`);
  }
  updateQualification(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}`, data);
  }
  createQualification(qualification: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, qualification);
  }
}
