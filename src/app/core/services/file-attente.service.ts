import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FileAttente } from '../models/fileAttente';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class FileAttenteService {
  private apiUrl = `${environment.apiUrl}/waitingQueues`;

  constructor(private http: HttpClient) {}

  getAllFileAttente(cabinetId: string,  page: number, size: number): Observable<Page<FileAttente>> {
    return this.http.get<Page<FileAttente>>(`${this.apiUrl}/cabinet/${cabinetId}/waitingQueues?page=${page}&size=${size}`);
  }

  createFileAttente(fileAttente: FileAttente): Observable<FileAttente> {
    return this.http.post<FileAttente>(this.apiUrl, fileAttente);
  }

  updateFileAttente(fileAttente: FileAttente): Observable<FileAttente> {
    return this.http.patch<FileAttente>(`${this.apiUrl}`, fileAttente);
  }

  searchFileAttente(cabinetId: string, query: string, page: number, size: number): Observable<Page<FileAttente>> {
    return this.http.get<Page<FileAttente>>(`${this.apiUrl}/cabinet/${cabinetId}/search?query=${query}&page=${page}&size=${size}`);
  }
}