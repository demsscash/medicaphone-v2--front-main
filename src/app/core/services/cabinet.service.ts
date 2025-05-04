import { Injectable } from '@angular/core';
import { Page } from '../models/page';
import { Patient } from '../models/patient';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { ReferenceMesure } from '../models/ReferenceMesure';

@Injectable({
  providedIn: 'root'
})
export class CabinetService {

  private apiUrl = `${environment.apiUrl}/cabinets`;

  constructor(private http: HttpClient) {}

    searchPatients(cabinetId: string, query: string, page: number = 0, size: number = 5): Observable<Page<Patient>> {
      const params = new HttpParams()
        .set('page', page.toString()) 
        .set('size', size.toString());
    
      return this.http.get<Page<Patient>>(`${this.apiUrl}/${cabinetId}/patients`, { params }).pipe(
        map((page: Page<Patient>) => {
          const filteredPatients = page.content.filter(patient =>
            patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(query.toLowerCase())
          );
          return {
            ...page,
            content: filteredPatients,
            totalElements: filteredPatients.length
          };
        })
      );
    }
    getReferenceMesureByCabinet(cabinetId: string): Observable<ReferenceMesure[]> {
      return this.http.get<ReferenceMesure[]>(`${this.apiUrl}/${cabinetId}/reference-mesures`);
    }
}
