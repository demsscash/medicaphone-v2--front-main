// src/app/core/services/audio-storage.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

export interface AudioNote {
    id: number;
    blob: Blob;
    duration: string;
    createdAt: Date;
    waveform?: number[];
}

@Injectable({
    providedIn: 'root'
})
export class AudioStorageService {
    private audioNotes = new BehaviorSubject<Map<number, AudioNote>>(new Map());
    private nextId = 1;

    constructor() {
        // Essayer de récupérer les notes depuis le stockage local au démarrage
        this.loadFromLocalStorage();
    }

    // Ajouter un nouvel enregistrement audio
    addAudioNote(blob: Blob, duration: string, waveform?: number[]): number {
        const id = this.nextId++;
        const createdAt = new Date();

        const newNote: AudioNote = {
            id,
            blob,
            duration,
            createdAt,
            waveform
        };

        const currentNotes = this.audioNotes.value;
        currentNotes.set(id, newNote);
        this.audioNotes.next(currentNotes);

        // Sauvegarder dans le stockage local
        this.saveToLocalStorage();

        return id;
    }

    // Récupérer toutes les notes audio
    getAudioNotes(): Observable<AudioNote[]> {
        return this.audioNotes.pipe(
            map(notesMap => Array.from(notesMap.values()))
        );
    }

    // Récupérer une note audio spécifique
    getAudioNoteById(id: number): Observable<AudioNote | undefined> {
        return this.audioNotes.pipe(
            map(notesMap => notesMap.get(id))
        );
    }

    // Supprimer une note audio
    deleteAudioNote(id: number): Observable<boolean> {
        const currentNotes = this.audioNotes.value;
        const success = currentNotes.delete(id);

        if (success) {
            this.audioNotes.next(currentNotes);
            this.saveToLocalStorage();
        }

        return of(success);
    }

    // Stockage local - ces fonctions sont simplifiées car les Blobs ne peuvent pas être 
    // directement stockés dans localStorage. Dans une application réelle, ces données 
    // seraient persistées sur un serveur.
    private saveToLocalStorage(): void {
        // Note: Cette implémentation est simplifiée - dans une vraie application,
        // les blobs audio devraient être stockés sur un serveur ou utiliser IndexedDB
        // localStorage ne peut pas stocker directement des Blobs

        const serializableNotes: any[] = [];
        this.audioNotes.value.forEach((note) => {
            // Dans une vraie implémentation, nous enverrions le blob au serveur
            // et stockerions une référence
            serializableNotes.push({
                id: note.id,
                duration: note.duration,
                createdAt: note.createdAt.toISOString(),
                waveform: note.waveform
            });
        });

        try {
            localStorage.setItem('audioNotes', JSON.stringify(serializableNotes));
            localStorage.setItem('nextAudioId', this.nextId.toString());
        } catch (e) {
            console.error('Erreur lors de la sauvegarde dans localStorage:', e);
        }
    }

    private loadFromLocalStorage(): void {
        // Cette méthode est incluse pour compléter l'API, mais dans une vraie implémentation,
        // les blobs seraient chargés depuis le serveur
        try {
            const savedNextId = localStorage.getItem('nextAudioId');
            if (savedNextId) {
                this.nextId = parseInt(savedNextId, 10);
            }

            // Note: Nous ne pouvons pas réellement restaurer les blobs depuis localStorage
            // Dans une vraie application, nous chargerions les métadonnées ici et chargerions
            // les fichiers audio à la demande
        } catch (e) {
            console.error('Erreur lors du chargement depuis localStorage:', e);
        }
    }
}