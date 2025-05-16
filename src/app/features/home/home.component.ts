

// src/app/features/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceRecorderComponent } from '../../shared/components/voice-recorder/voice-recorder.component';
import { AudioRecordingService } from '../../core/services/audio-recording.service';
import { ToastService } from '../../core/services/toast.service';

interface Note {
  id: number;
  patient: string;
  patientAvatar: string;
  object: string;
  audio: {
    duration: string;
    waveform: number[];
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
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, VoiceRecorderComponent],
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
      creationDate: '16/04/2025 - 10:06'
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
      }
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
      }
    }
  ];

  constructor(
    private audioRecordingService: AudioRecordingService,
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

    // Créer les métadonnées
    const metadata = {
      patientId: '', // Vide si patient non identifié
      object: 'Non identifié',
      creationDate: new Date().toISOString()
    };

    // Envoi au serveur dans une implémentation réelle
    // this.audioRecordingService.uploadAudioRecording(audioBlob, metadata).subscribe(
    //   (response) => {
    //     this.toastService.show('Enregistrement envoyé avec succès', 'success');
    //     this.loadNotesByStatus('pending'); // Rafraîchir la liste des notes
    //   },
    //   (error) => {
    //     console.error('Erreur lors de l\'envoi de l\'enregistrement:', error);
    //     this.toastService.show('Erreur lors de l\'envoi de l\'enregistrement', 'error');
    //   }
    // );

    // Afficher un message de succès pour la démonstration
    this.toastService.show('Enregistrement envoyé avec succès', 'success');

    // Ajouter un nouvel enregistrement à la liste pour la démonstration
    const newNote: Note = {
      id: Date.now(), // ID temporaire
      patient: 'Patient non identifié',
      patientAvatar: '',
      object: 'Non identifié',
      audio: {
        duration: '00:07', // Durée fictive
        waveform: Array(50).fill(0).map(() => Math.random())
      },
      status: 'pending',
      creationDate: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    this.notes.unshift(newNote);
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