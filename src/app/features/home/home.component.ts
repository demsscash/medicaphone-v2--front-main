// src/app/features/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Note {
  id: number;
  patient: string;
  patientAvatar: string;
  object: string;
  audio: {
    duration: string;
    waveform: number[];
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
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeTab = 'Notes';
  selectedNote: number | null = null;

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

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleMenu(noteId: number): void {
    this.selectedNote = this.selectedNote === noteId ? null : noteId;
  }

  getFilteredNotes(): Note[] {
    switch (this.activeTab) {
      case 'Notes':
        return this.notes.filter(note => note.status === 'pending');
      case 'Traitée':
        return this.notes.filter(note => note.status === 'processed');
      case 'Validée':
        return this.notes.filter(note => note.status === 'validated');
      default:
        return this.notes;
    }
  }
}