import { Component, EventEmitter, Output, HostListener, NgZone, OnDestroy } from '@angular/core';
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
export class VoiceRecorderComponent implements OnDestroy {
    @Output() recordingComplete = new EventEmitter<Blob>();
    @Output() recordingCancelled = new EventEmitter<void>();

    // États d'enregistrement
    recordingState = RecordingState.IDLE;
    mediaRecorder: MediaRecorder | null = null;
    audioChunks: BlobPart[] = [];
    recordingTime = 0;
    recordingTimer: any;

    // Gestion du toucher et glissement
    startX = 0;
    currentX = 0;
    touchIdentifier: number | null = null;
    isLongPress = false;
    longPressTimeout: any;

    // Configuration
    cancellationThreshold = 100; // Pixels à glisser vers la gauche pour annuler

    // Variables pour l'interface utilisateur
    slidingProgress = 0; // 0-100%
    get slidingDistance(): number {
        return this.slidingProgress > 0 ? (this.cancellationThreshold - (this.startX - this.currentX)) : 0;
    }

    constructor(private ngZone: NgZone) { }

    ngOnDestroy(): void {
        this.cleanup();
    }

    // Getters d'état pour le template
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

    // Format du temps d'enregistrement (00:00)
    get formattedTime(): string {
        const minutes = Math.floor(this.recordingTime / 60);
        const seconds = this.recordingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // -------------------- GESTION DES ÉVÉNEMENTS TACTILES --------------------

    // Gérer le toucher initial - démarrage de l'enregistrement
    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        if (this.recordingState !== RecordingState.IDLE) return;
        event.preventDefault();

        const touch = event.touches[0];
        this.touchIdentifier = touch.identifier;
        this.startX = touch.clientX;
        this.currentX = touch.clientX;

        // Démarrer un minuteur pour détecter l'appui long (comme WhatsApp)
        this.longPressTimeout = setTimeout(() => {
            this.ngZone.run(() => {
                this.isLongPress = true;
                this.startRecording();
            });
        }, 200); // 200ms pour un appui long
    }

    // Gérer le clic initial - pour version desktop
    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (this.recordingState !== RecordingState.IDLE) return;
        event.preventDefault();

        this.startX = event.clientX;
        this.currentX = event.clientX;

        // Démarrer un minuteur pour détecter l'appui long
        this.longPressTimeout = setTimeout(() => {
            this.ngZone.run(() => {
                this.isLongPress = true;
                this.startRecording();
            });
        }, 200);
    }

    // Gérer le mouvement du doigt pendant l'enregistrement
    @HostListener('document:touchmove', ['$event'])
    onTouchMove(event: TouchEvent): void {
        if (!this.isLongPress || this.recordingState !== RecordingState.RECORDING) return;

        // Trouver le toucher qui correspond à notre identifiant enregistré
        const touch = Array.from(event.touches).find(t => t.identifier === this.touchIdentifier);
        if (!touch) return;

        this.currentX = touch.clientX;
        this.updateSlidingState();
    }

    // Gérer le mouvement de la souris pendant l'enregistrement - pour version desktop
    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (!this.isLongPress || this.recordingState !== RecordingState.RECORDING) return;

        this.currentX = event.clientX;
        this.updateSlidingState();
    }

    // Mettre à jour l'état du glissement
    private updateSlidingState(): void {
        // Calculer la distance de glissement (WhatsApp utilise un glissement horizontal)
        const distance = this.startX - this.currentX;

        // Calculer le pourcentage de progression vers l'annulation
        this.slidingProgress = Math.max(0, Math.min(100, (distance / this.cancellationThreshold) * 100));

        // Si la distance dépasse le seuil, activer le mode annulation
        if (distance > this.cancellationThreshold) {
            this.recordingState = RecordingState.CANCELLING;
        } else {
            this.recordingState = RecordingState.RECORDING;
        }
    }

    // Gérer la fin du toucher - fin de l'enregistrement ou annulation
    @HostListener('document:touchend', ['$event'])
    @HostListener('document:touchcancel', ['$event'])
    onTouchEnd(event: TouchEvent): void {
        this.clearLongPressTimeout();

        if (!this.isLongPress) return;

        this.finalizeRecording();
    }

    // Gérer le relâchement de la souris - fin de l'enregistrement ou annulation - pour version desktop
    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.clearLongPressTimeout();

        if (!this.isLongPress) return;

        this.finalizeRecording();
    }

    // Effacer le minuteur d'appui long
    private clearLongPressTimeout(): void {
        if (this.longPressTimeout) {
            clearTimeout(this.longPressTimeout);
            this.longPressTimeout = null;
        }
    }

    // Finaliser l'enregistrement (arrêter ou annuler)
    private finalizeRecording(): void {
        this.isLongPress = false;
        this.touchIdentifier = null;

        // Si en mode annulation, annuler l'enregistrement
        if (this.recordingState === RecordingState.CANCELLING) {
            this.cancelRecording();
        }
        // Sinon, finaliser l'enregistrement
        else if (this.recordingState === RecordingState.RECORDING) {
            this.stopRecording();
        }
    }

    // -------------------- GESTION DE L'ENREGISTREMENT AUDIO --------------------

    // Démarrer l'enregistrement audio
    private async startRecording(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.recordingTime = 0;
            this.slidingProgress = 0;

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.start();
            this.recordingState = RecordingState.RECORDING;

            // Démarrer le minuteur
            this.recordingTimer = setInterval(() => {
                this.ngZone.run(() => {
                    this.recordingTime++;
                });
            }, 1000);
        } catch (error) {
            console.error('Erreur d\'accès au microphone:', error);
        }
    }

    // Arrêter l'enregistrement audio et l'envoyer
    private stopRecording(): void {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;

        clearInterval(this.recordingTimer);
        this.recordingState = RecordingState.SENDING;

        try {
            // Demander des données avant d'arrêter
            this.mediaRecorder.requestData();

            this.mediaRecorder.onstop = () => {
                if (this.audioChunks.length > 0) {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    this.recordingComplete.emit(audioBlob);
                }

                // Nettoyer
                this.cleanup();
            };

            this.mediaRecorder.stop();
        } catch (e) {
            console.error('Erreur lors de l\'arrêt de l\'enregistrement:', e);
            this.cleanup();
        }
    }

    // Annuler l'enregistrement audio
    private cancelRecording(): void {
        if (!this.mediaRecorder) return;

        clearInterval(this.recordingTimer);

        try {
            if (this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            // Émettre l'événement d'annulation
            this.recordingCancelled.emit();

            // Nettoyer
            this.cleanup();
        } catch (e) {
            console.error('Erreur lors de l\'annulation de l\'enregistrement:', e);
            this.cleanup();
        }
    }

    // Nettoyer les ressources
    private cleanup(): void {
        // Arrêter le minuteur
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }

        // Arrêter l'enregistrement
        if (this.mediaRecorder?.stream) {
            const tracks = this.mediaRecorder.stream.getTracks();
            tracks.forEach(track => track.stop());
        }

        // Réinitialiser l'état
        setTimeout(() => {
            this.ngZone.run(() => {
                this.audioChunks = [];
                this.recordingState = RecordingState.IDLE;
                this.recordingTime = 0;
                this.slidingProgress = 0;
                this.startX = 0;
                this.currentX = 0;
            });
        }, 300);
    }
}