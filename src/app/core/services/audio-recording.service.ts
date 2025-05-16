// src/app/core/services/audio-recording.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AudioRecordingService {
    private apiUrl = `${environment.apiUrl}/audio-notes`;

    constructor(private http: HttpClient) { }

    /**
     * Envoie l'enregistrement audio au serveur
     * @param audioBlob Fichier audio enregistré
     * @param metadata Métadonnées associées à l'enregistrement
     * @returns Observable du résultat de l'envoi
     */
    uploadAudioRecording(audioBlob: Blob, metadata: any): Observable<any> {
        const formData = new FormData();

        // Ajouter le fichier audio
        formData.append('audioFile', audioBlob, 'recording.webm');

        // Ajouter les métadonnées
        for (const key in metadata) {
            if (metadata.hasOwnProperty(key)) {
                formData.append(key, metadata[key]);
            }
        }

        return this.http.post<any>(`${this.apiUrl}/upload`, formData);
    }

    /**
     * Récupère les notes audio de l'utilisateur
     * @returns Observable de la liste des notes audio
     */
    getUserAudioNotes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/user`);
    }

    /**
     * Récupère les notes audio par statut
     * @param status Statut des notes à récupérer (pending, processed, validated)
     * @returns Observable de la liste des notes audio
     */
    getAudioNotesByStatus(status: 'pending' | 'processed' | 'validated'): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/status/${status}`);
    }

    /**
     * Supprime une note audio
     * @param noteId Identifiant de la note à supprimer
     * @returns Observable du résultat de la suppression
     */
    deleteAudioNote(noteId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${noteId}`);
    }

    /**
     * Télécharge le rapport PDF généré pour une note audio
     * @param noteId Identifiant de la note
     * @returns Observable du blob PDF
     */
    downloadPdfReport(noteId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${noteId}/pdf`, {
            responseType: 'blob'
        });
    }
}