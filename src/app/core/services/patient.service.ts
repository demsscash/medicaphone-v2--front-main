import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../models/patient';
import { map, Observable, of, tap } from 'rxjs';
import { Page } from '../models/page';
import { RapportGenetique } from '../models/RapportGenetique';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;
  private patientId!: string;
  private folderId!: string;

  constructor(private http: HttpClient) {}

  getPatients(
    cabinetId: string,
    page: number,
    size: number
  ): Observable<Page<Patient>> {
    return this.http.get<Page<Patient>>(
      `${environment.apiUrl}/cabinets/${cabinetId}/patients?page=${page}&size=${size}`
    );
  }

  searchPatients(
    cabinetId: string,
    query: string,
    page: number,
    size: number
  ): Observable<Page<Patient>> {
    return this.http.get<Page<Patient>>(
      `${environment.apiUrl}/cabinets/${cabinetId}/patients/search?query=${query}&page=${page}&size=${size}`
    );
  }

  getPatientById(id: string): Observable<Patient> {
    console.log('Fetching patient with ID', id);
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  getRapportGenetiqueByPatientId(
    patientId: string
  ): Observable<RapportGenetique> {
    return this.http.get<RapportGenetique>(
      `${this.apiUrl}/${patientId}/genetic-report`
    );
  }

  createRapportGenetique(patientId: string, rapportData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${patientId}/genetic-report`,
      rapportData
    );
  }
  
  updateRapportGenetique(patientId: string, rapportData: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${patientId}/genetic-report`,
      rapportData
    );
  }
  
  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(
      `${environment.apiUrl}/auth/registerPatient`,
      patient
    );
  }

  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}`, patient);
  }

  deletePatient(patientId: string) {
    return this.http.delete(`${this.apiUrl}/${patientId}`, {
      responseType: 'text',
    });
  }

  setPatientId(data: string) {
    this.patientId = data;
  }

  getPatientId() {
    return this.patientId;
  }
  setFolderId(data: string) {
    this.folderId = data;
  }
  getFolderId(patientId: string): Observable<string> {
    if (this.folderId) {
      return of(this.folderId);
    }
    return this.http.get<any>(`${environment.apiUrl}/folders/${patientId}`).pipe(
      map(response => response.id), 
      tap(id => this.folderId = id) 
    );
  }
}
