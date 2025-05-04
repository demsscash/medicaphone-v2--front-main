import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MedicalRecord } from '../models/medicalRecord';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  constructor(private http: HttpClient) { }

  getRapportsByPatient(patientId: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${environment.apiUrl}/api/rapports/patient/${patientId}`);
  }
  uploadDocument(patientId: string, nom: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('nom', nom);
    formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/api/rapports/upload`, formData);
  }
  createDocument(patientId: string, nom: string, contenu: string): Observable<any> {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('nom', nom);
    formData.append('contenu', contenu);

    return this.http.post(`${environment.apiUrl}/api/rapports/create`, formData);
  }
  deleteRapport(rapportId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/rapports/${rapportId}`);
  }
  downloadDocument(rapportId: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/api/rapports/download/${rapportId}`, {
      responseType: 'blob'
    });
  }
  updateDocumentText(rapportId: string, nom: string, contenu: string): Observable<MedicalRecord> {
    const rapportDto = {
      id: rapportId,
      nom: nom,
      contenu: contenu
    };

    return this.http.put<MedicalRecord>(
      `${environment.apiUrl}/api/rapports`,
      rapportDto
    );
  }

  // Mettre à jour un rapport fichier
  updateDocumentFile(rapportId: string, nom: string, file: File): Observable<Document> {
    const formData = new FormData();
    formData.append('rapportId', rapportId);
    if (nom) formData.append('nom', nom);
    formData.append('file', file);

    return this.http.put<Document>(
      `${environment.apiUrl}/api/rapports/file`,
      formData
    );
  }
}
