// src/app/features/home/home.component.ts - fichier complet
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceRecorderComponent } from '../../shared/voice-recorder/voice-recorder.component';
import { AudioPlayerComponent } from '../../shared/audio-player/audio-player.component';
import { AudioRecordingService } from '../../core/services/audio-recording.service';
import { AudioStorageService, AudioNote } from '../../core/services/audio-storage.service';
import { ToastService } from '../../core/services/toast.service';

interface Note {
  id: number;
  patient: string;
  patientAvatar: string;
  object: string;
  audio: {
    duration: string;
    waveform: number[];
    blob?: Blob;
    url?: string;
  };
  status: 'pending' | 'processed' | 'validated';
  creationDate: string;
  processedDate?: string;
  validationDate?: string;
  assignedTo?: {
    name: string;
    avatar: string;
  };
  isPlaying?: boolean;
  showPlayer?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, VoiceRecorderComponent, AudioPlayerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeTab = 'Notes';
  selectedNote: number | null = null;
  isRecording = false;
  showRecordingInterface = false;

  tabs = ['Notes', 'Traitée', 'Validée'];

  notes: Note[] = [
    {
      id: 1,
      patient: 'Patient non identifié',
      patientAvatar: '',
      object: 'Non identifié',
      audio: {
        duration: '02:34',
        waveform: Array(50).fill(0).map(() => Math.random())
      },
      status: 'pending',
      creationDate: '16/04/2025 - 10:06',
      showPlayer: false
    },
    {
      id: 2,
      patient: 'Patient X',
      patientAvatar: 'assets/images/patient-avatar.jpg',
      object: 'Non identifié',
      audio: {
        duration: '02:34',
        waveform: Array(50).fill(0).map(() => Math.random())
      },
      status: 'processed',
      creationDate: '16/04/2025 - 10:06',
      processedDate: '16/04/2025 - 11:06',
      assignedTo: {
        name: 'Émilie Emma',
        avatar: 'assets/images/doctor-avatar.jpg'
      },
      showPlayer: false
    },
    {
      id: 3,
      patient: 'Patient X',
      patientAvatar: 'assets/images/patient-avatar.jpg',
      object: 'objet X',
      audio: {
        duration: '02:34',
        waveform: Array(50).fill(0).map(() => Math.random())
      },
      status: 'validated',
      creationDate: '16/04/2025 - 10:06',
      processedDate: '16/04/2025 - 11:06',
      validationDate: '16/04/2025 - 12:30',
      assignedTo: {
        name: 'Émilie Emma',
        avatar: 'assets/images/doctor-avatar.jpg'
      },
      showPlayer: false
    }
  ];

  // Suivi des enregistrements dans notre session actuelle
  recentRecordings: Map<number, Blob> = new Map();

  constructor(
    private audioRecordingService: AudioRecordingService,
    private audioStorageService: AudioStorageService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    // Charger les notes audio selon l'onglet actif
    this.loadNotesByStatus(this.getStatusForTab(this.activeTab));
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.loadNotesByStatus(this.getStatusForTab(tab));
  }

  toggleMenu(noteId: number): void {
    this.selectedNote = this.selectedNote === noteId ? null : noteId;
  }

  toggleAudioPlayer(noteId: number): void {
    // Trouver la note correspondante
    const note = this.notes.find(n => n.id === noteId);
    if (note) {
      // Basculer la visibilité du lecteur audio
      note.showPlayer = !note.showPlayer;

      // Si nous montrons le lecteur et qu'il n'y a pas encore de blob
      if (note.showPlayer && !note.audio.blob) {
        // Vérifier si nous avons un enregistrement temporaire pour cette note
        if (this.recentRecordings.has(noteId)) {
          note.audio.blob = this.recentRecordings.get(noteId)!;
        } else {
          // Dans une application réelle, nous chargerions l'audio depuis le serveur
          // Simulons cela pour le moment
          this.tryLoadAudioForNote(note);
        }
      }
    }
  }

  // Méthode pour tenter de charger l'audio d'une note (simulation)
  private tryLoadAudioForNote(note: Note): void {
    // En réalité, nous ferions un appel API ici pour récupérer le fichier audio
    // Pour la démonstration, nous allons simuler l'absence d'audio pour les notes prédéfinies

    this.toastService.show('Cet enregistrement n\'est plus disponible en local.', 'error');

    // Idéalement, l'API renverrait un Blob que nous assignerions ici:
    // this.audioApiService.getAudioBlob(note.id).subscribe(blob => {
    //   note.audio.blob = blob;
    // });
  }

  getFilteredNotes(): Note[] {
    const status = this.getStatusForTab(this.activeTab);
    return this.notes.filter(note => note.status === status);
  }

  private getStatusForTab(tab: string): 'pending' | 'processed' | 'validated' {
    switch (tab) {
      case 'Notes': return 'pending';
      case 'Traitée': return 'processed';
      case 'Validée': return 'validated';
      default: return 'pending';
    }
  }

  private loadNotesByStatus(status: 'pending' | 'processed' | 'validated'): void {
    // Dans une implémentation réelle, appeler le service pour charger les notes
    // this.audioRecordingService.getAudioNotesByStatus(status).subscribe(
    //   (notes) => {
    //     // Transformer les notes reçues au format attendu
    //     this.notes = notes.map(this.mapApiNoteToViewModel);
    //   },
    //   (error) => {
    //     console.error('Erreur lors du chargement des notes:', error);
    //     this.toastService.show('Erreur lors du chargement des notes', 'error');
    //   }
    // );

    // Pour le moment, utilisons les données fictives
    console.log(`Chargement des notes avec le statut: ${status}`);
  }

  onRecordingComplete(audioBlob: Blob): void {
    console.log('Enregistrement terminé, taille:', audioBlob.size, 'bytes');

    // Générer une forme d'onde aléatoire pour la démonstration
    const waveform = Array(50).fill(0).map(() => Math.random());

    // Création d'une nouvelle note avec l'audio enregistré
    const newNoteId = Date.now();

    // Stocker le blob dans notre map temporaire
    this.recentRecordings.set(newNoteId, audioBlob);

    // Calculer la durée réelle (ou l'estimer) - pour la démo, nous utilisons une durée fictive
    const estimatedDuration = this.estimateAudioDuration(audioBlob);

    // Créer une nouvelle note
    const newNote: Note = {
      id: newNoteId,
      patient: 'Patient non identifié',
      patientAvatar: '',
      object: 'Non identifié',
      audio: {
        duration: estimatedDuration,
        waveform: waveform,
        blob: audioBlob // Stocker directement le blob
      },
      status: 'pending',
      creationDate: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      showPlayer: false
    };

    // Ajouter la note à notre liste
    this.notes.unshift(newNote);

    // Afficher un message de succès
    this.toastService.show('Enregistrement enregistré avec succès', 'success');

    // Dans une application réelle, nous enverrions l'audio au serveur
    // this.audioRecordingService.uploadAudioRecording(audioBlob, metadata).subscribe(...);
  }

  // Estimer la durée de l'audio - dans une application réelle, vous pourriez utiliser la Web Audio API
  private estimateAudioDuration(blob: Blob): string {
    // Pour la démonstration, nous retournons une durée fictive
    // En réalité, vous pourriez utiliser la taille du blob et le débit pour estimer la durée
    // Ou lire le fichier audio pour obtenir sa durée exacte

    // Estimation très grossière basée sur la taille (1MB ≈ 1 minute pour l'audio webm à faible débit)
    const minutes = Math.floor((blob.size / (1024 * 1024)) * 1);
    const seconds = Math.floor((blob.size % (1024 * 1024)) / (1024 * 1024 / 60));

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  onRecordingCancelled(): void {
    console.log('Enregistrement annulé');
    this.toastService.show('Enregistrement annulé', 'error');
  }

  downloadPdf(noteId: number): void {
    // Dans une implémentation réelle
    // this.audioRecordingService.downloadPdfReport(noteId.toString()).subscribe(
    //   (blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `rapport_${noteId}.pdf`;
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     a.remove();
    //   },
    //   (error) => {
    //     console.error('Erreur lors du téléchargement du PDF:', error);
    //     this.toastService.show('Erreur lors du téléchargement du PDF', 'error');
    //   }
    // );

    // Pour la démonstration
    this.toastService.show('Téléchargement du PDF en cours...', 'success');
  }

  deleteNote(noteId: number): void {
    // Supprimer l'enregistrement temporaire s'il existe
    if (this.recentRecordings.has(noteId)) {
      this.recentRecordings.delete(noteId);
    }

    // Dans une implémentation réelle
    // this.audioRecordingService.deleteAudioNote(noteId.toString()).subscribe(
    //   () => {
    //     this.notes = this.notes.filter(note => note.id !== noteId);
    //     this.toastService.show('Note supprimée avec succès', 'success');
    //   },
    //   (error) => {
    //     console.error('Erreur lors de la suppression de la note:', error);
    //     this.toastService.show('Erreur lors de la suppression de la note', 'error');
    //   }
    // );

    // Pour la démonstration
    this.notes = this.notes.filter(note => note.id !== noteId);
    this.toastService.show('Note supprimée avec succès', 'success');
    this.selectedNote = null;
  }

  editNote(noteId: number): void {
    // Rediriger vers la page d'édition ou ouvrir un modal
    console.log('Édition de la note:', noteId);
    this.toastService.show('Fonctionnalité d\'édition à implémenter', 'success');
    this.selectedNote = null;
  }
}