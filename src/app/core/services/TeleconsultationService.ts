import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeleconsultationService {
  private apiUrl = `${environment.apiUrl}/api/video-consultations`;

  constructor(private http: HttpClient) {}

  getPatientVideoConsultations(patientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients/${patientId}`);
  }

  getSignature(meetingId: string, role: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/signature?meetingId=${meetingId}&role=${role}`, {
      responseType: 'text'
    });
  }  

  createVideoConsultation(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

  startInstantConsultation(cabinetId: string, patientId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/instant?cabinetId=${cabinetId}&patientId=${patientId}`, {});
  }

  cancelVideoConsultation(appointmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${appointmentId}`);
  }
}