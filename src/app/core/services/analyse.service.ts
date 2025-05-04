import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MedicalRecord } from '../models/medicalRecord';

@Injectable({
  providedIn: 'root'
})
export class AnalyseService {

  constructor(private http: HttpClient) { }

  getAnalysesByPatient(patientId: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${environment.apiUrl}/analyses/patient/${patientId}`);
  }

  uploadDocument(patientId: string, nom: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('nom', nom);
    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/analyses/upload`, formData);
  }

  createDocument(patientId: string, nom: string, contenu: string): Observable<any> {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('nom', nom);
    formData.append('contenu', contenu);

    return this.http.post(`${environment.apiUrl}/analyses/create`, formData);
  }

  deleteAnalyse(analyseId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/analyses/${analyseId}`);
  }

  downloadDocument(analyseId: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/analyses/download/${analyseId}`, {
      responseType: 'blob'
    });
  }

  updateDocumentText(analyseId: string, nom: string, contenu: string): Observable<MedicalRecord> {
    const analyseDto = {
      id: analyseId,
      nom: nom,
      contenu: contenu
    };

    return this.http.put<MedicalRecord>(
      `${environment.apiUrl}/analyses`,
      analyseDto
    );
  }

  updateDocumentFile(analyseId: string, nom: string, file: File): Observable<MedicalRecord> {
    const formData = new FormData();
    formData.append('analyseId', analyseId);
    if (nom) formData.append('nom', nom);
    formData.append('file', file);

    return this.http.put<MedicalRecord>(
      `${environment.apiUrl}/analyses/file`,
      formData
    );
  }
}