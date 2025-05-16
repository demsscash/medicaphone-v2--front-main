// src/app/shared/components/voice-recorder/voice-recorder.component.ts
import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

enum RecordingState {
    IDLE,
    RECORDING,
    SENDING,
    CANCELLING
}

@Component({
    selector: 'app-voice-recorder',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './voice-recorder.component.html',
    styleUrls: ['./voice-recorder.component.scss']
})
export class VoiceRecorderComponent {
    @Output() recordingComplete = new EventEmitter<Blob>();
    @Output() recordingCancelled = new EventEmitter<void>();

    recordingState = RecordingState.IDLE;
    mediaRecorder: MediaRecorder | null = null;
    audioChunks: BlobPart[] = [];
    recordingTime = 0;
    recordingTimer: any;
    startY = 0;
    currentY = 0;
    isDragging = false;
    cancellationThreshold = 70; // Pixels to move up to cancel

    // Getter pour les états de l'enregistrement pour le template
    get isIdle(): boolean {
        return this.recordingState === RecordingState.IDLE;
    }

    get isRecording(): boolean {
        return this.recordingState === RecordingState.RECORDING;
    }

    get isSending(): boolean {
        return this.recordingState === RecordingState.SENDING;
    }

    get isCancelling(): boolean {
        return this.recordingState === RecordingState.CANCELLING;
    }

    // Formater le temps d'enregistrement (00:00)
    get formattedTime(): string {
        const minutes = Math.floor(this.recordingTime / 60);
        const seconds = this.recordingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Calculer la position Y relative
    get dragOffset(): number {
        return this.isDragging ? this.startY - this.currentY : 0;
    }

    // Déterminer si le seuil d'annulation est atteint
    get isCancelThresholdReached(): boolean {
        return this.dragOffset > this.cancellationThreshold;
    }

    // Démarrage de l'enregistrement au toucher/clic long
    onRecordStart(event: TouchEvent | MouseEvent): void {
        event.preventDefault();

        if (this.recordingState !== RecordingState.IDLE) return;

        // Capturer la position de départ
        if (event instanceof TouchEvent) {
            this.startY = event.touches[0].clientY;
        } else {
            this.startY = event.clientY;
        }

        this.isDragging = true;
        this.startRecording();
    }

    // Gestion du mouvement pendant l'enregistrement
    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onMouseMove(event: MouseEvent | TouchEvent): void {
        if (!this.isDragging || this.recordingState !== RecordingState.RECORDING) return;

        if (event instanceof TouchEvent) {
            this.currentY = event.touches[0].clientY;
        } else {
            this.currentY = event.clientY;
        }

        // Si le mouvement vers le haut dépasse le seuil, entrer en mode annulation
        if (this.isCancelThresholdReached) {
            this.recordingState = RecordingState.CANCELLING;
        } else {
            this.recordingState = RecordingState.RECORDING;
        }
    }

    // Fin de l'enregistrement au relâchement
    @HostListener('document:mouseup', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onRecordEnd(): void {
        if (!this.isDragging) return;

        this.isDragging = false;

        // Si en mode annulation, annuler l'enregistrement
        if (this.recordingState === RecordingState.CANCELLING) {
            this.cancelRecording();
        }
        // Sinon, finaliser l'enregistrement
        else if (this.recordingState === RecordingState.RECORDING) {
            this.stopRecording();
        }
    }

    // Démarrage de l'enregistrement
    private async startRecording(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.recordingTime = 0;

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.start();
            this.recordingState = RecordingState.RECORDING;

            // Démarrer le minuteur
            this.recordingTimer = setInterval(() => {
                this.recordingTime++;
            }, 1000);
        } catch (error) {
            console.error('Erreur d\'accès au microphone:', error);
        }
    }

    // Arrêt de l'enregistrement
    private stopRecording(): void {
        if (!this.mediaRecorder) return;

        this.mediaRecorder.stop();
        this.recordingState = RecordingState.SENDING;

        clearInterval(this.recordingTimer);

        // Attendre que tous les chunks soient disponibles
        this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            this.recordingComplete.emit(audioBlob);

            // Arrêter tous les tracks du stream
            const tracks = this.mediaRecorder?.stream.getTracks();
            tracks?.forEach(track => track.stop());

            // Réinitialiser l'état
            setTimeout(() => {
                this.recordingState = RecordingState.IDLE;
            }, 500);
        };
    }

    // Annulation de l'enregistrement
    private cancelRecording(): void {
        if (!this.mediaRecorder) return;

        clearInterval(this.recordingTimer);

        // Arrêter l'enregistrement sans traiter les données
        this.mediaRecorder.stop();

        // Arrêter tous les tracks du stream
        const tracks = this.mediaRecorder?.stream.getTracks();
        tracks?.forEach(track => track.stop());

        this.recordingCancelled.emit();

        // Réinitialiser l'état
        setTimeout(() => {
            this.recordingState = RecordingState.IDLE;
        }, 500);
    }
}