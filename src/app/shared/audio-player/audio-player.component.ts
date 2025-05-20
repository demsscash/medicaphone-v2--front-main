// src/app/shared/audio-player/audio-player.component.ts
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-audio-player',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './audio-player.component.html',
    styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
    @Input() audioSrc: string | Blob | null = null;
    @Input() waveform: number[] = [];
    @Input() duration: string = '00:00';

    isPlaying: boolean = false;
    currentTime: string = '00:00';
    progress: number = 0;
    audioElement: HTMLAudioElement | null = null;
    objectUrl: string | null = null;

    ngOnInit(): void {
        this.initAudioPlayer();
    }

    ngOnDestroy(): void {
        this.cleanup();
    }

    initAudioPlayer(): void {
        if (!this.audioSrc) return;

        this.audioElement = new Audio();

        // Si l'audio est un Blob, crée une URL pour lui
        if (this.audioSrc instanceof Blob) {
            this.objectUrl = URL.createObjectURL(this.audioSrc);
            this.audioElement.src = this.objectUrl;
        } else {
            this.audioElement.src = this.audioSrc;
        }

        // Écouter les événements de l'élément audio
        this.audioElement.addEventListener('timeupdate', this.updateProgress.bind(this));
        this.audioElement.addEventListener('ended', this.onAudioEnded.bind(this));
        this.audioElement.addEventListener('error', this.onAudioError.bind(this));
    }

    updateProgress(): void {
        if (!this.audioElement) return;

        const currentSeconds = this.audioElement.currentTime;
        const totalSeconds = this.audioElement.duration || 0;

        // Mettre à jour le pourcentage de progression
        this.progress = (currentSeconds / totalSeconds) * 100;

        // Formater le temps actuel
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = Math.floor(currentSeconds % 60);
        this.currentTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    togglePlay(): void {
        if (!this.audioElement) return;

        if (this.isPlaying) {
            this.audioElement.pause();
        } else {
            this.audioElement.play().catch(error => {
                console.error('Erreur lors de la lecture audio:', error);
            });
        }

        this.isPlaying = !this.isPlaying;
    }

    onAudioEnded(): void {
        this.isPlaying = false;
        this.progress = 0;
        this.currentTime = '00:00';
    }

    onAudioError(error: any): void {
        console.error('Erreur de lecture audio:', error);
        this.isPlaying = false;
    }

    seekAudio(event: MouseEvent): void {
        if (!this.audioElement) return;

        const progressBar = event.currentTarget as HTMLDivElement;
        const rect = progressBar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;

        // Calculer la position relative (0-1)
        const percent = offsetX / width;

        // Définir la position actuelle de l'audio
        this.audioElement.currentTime = percent * this.audioElement.duration;
        this.updateProgress();
    }

    private cleanup(): void {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.removeEventListener('timeupdate', this.updateProgress);
            this.audioElement.removeEventListener('ended', this.onAudioEnded);
            this.audioElement.removeEventListener('error', this.onAudioError);
            this.audioElement = null;
        }

        // Libérer l'URL de l'objet blob si elle existe
        if (this.objectUrl) {
            URL.revokeObjectURL(this.objectUrl);
            this.objectUrl = null;
        }
    }
}