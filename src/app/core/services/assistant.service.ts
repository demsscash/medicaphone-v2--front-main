import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getMeets() {
    return this.http.get(
      `${this.apiUrl}/Zoom/GetVideoAppointmentByDoctor`
    );
  }
  getSignature(meetId: any) {
    return this.http.get(
      `${this.apiUrl}/Zoom/GenerateSignature?meetingId=${meetId}`,
      {
        responseType: 'text',
      }
    );
  }
}
