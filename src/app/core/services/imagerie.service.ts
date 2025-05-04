import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Imagerie } from '../models/imagerie';


@Injectable({
  providedIn: 'root'
})
export class ImagerieService {
  constructor(private http: HttpClient) { }

  uploadImagerie(folderId: string, titre: string, description: string, file: File): Observable<Imagerie> {
    const formData = new FormData();
    formData.append('folderId', folderId);
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('file', file);
    
    return this.http.post<Imagerie>(`${environment.apiUrl}/imageries/upload`, formData);
  }

  getAllImageriesByFolder(folderId: string): Observable<Imagerie[]> {
    return this.http.get<Imagerie[]>(`${environment.apiUrl}/imageries/dossier/${folderId}`);
  }

  getImagerieById(imagerieId: string): Observable<Imagerie> {
    return this.http.get<Imagerie>(`${environment.apiUrl}/imageries/${imagerieId}`);
  }

  deleteImagerie(imagerieId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/imageries/${imagerieId}`);
  }

  updateImagerie(imagerieId: string, titre: string, description: string, file?: File): Observable<Imagerie> {
    const formData = new FormData();
    formData.append('imagerieId', imagerieId);
    formData.append('titre', titre);
    formData.append('description', description);
    
    if (file) {
      formData.append('file', file);
    }
    
    return this.http.put<Imagerie>(`${environment.apiUrl}/imageries/file`, formData);
  }

  downloadDocument(imagerieId: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/imageries/download/${imagerieId}`, {
      responseType: 'blob'
    });
  }
}