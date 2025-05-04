import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Rapport } from '../../../core/models/rapport';
import { RapportService } from '../../../core/services/rapport.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-view-rapport',
  standalone: true,
  imports: [
    CommonModule,
    NgxExtendedPdfViewerModule
  ],
  templateUrl: './view-rapport.component.html',
  styleUrls: ['./view-rapport.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewRapportComponent implements OnInit {
  @Input() rapport: Rapport | null = null;
  @Output() close = new EventEmitter<void>();
  
  pdfSrc: string | null = null;
  isLoading: boolean = false;
  hasError: boolean = false;
  
  constructor(
    private rapportService: RapportService,
    private toastService: ToastService
  ) {}
  
  ngOnInit(): void {
    console.log('ViewRapportComponent initialized with rapport:', this.rapport);
    this.loadPdfDocument();
  }
  
  ngOnChanges(): void {
    console.log('ViewRapportComponent received changes, rapport:', this.rapport);
    if (this.rapport) {
      this.loadPdfDocument();
    }
  }
  
  loadPdfDocument(): void {
    if (!this.rapport || !this.rapport.id) {
      console.error('Invalid rapport or rapport ID is missing');
      this.hasError = true;
      return;
    }
    
    console.log('Loading PDF for rapport ID:', this.rapport.id);
    this.isLoading = true;
    this.hasError = false;
    
    this.rapportService.downloadRapport(this.rapport.id)
      .subscribe({
        next: (blob) => {
          console.log('PDF blob received:', blob.type, 'size:', blob.size);
          
          // Vérifier que le blob est valide
          if (blob.size === 0) {
            console.error('Empty PDF blob received');
            this.hasError = true;
            this.isLoading = false;
            this.toastService.show('Document PDF vide ou invalide', 'error');
            return;
          }
          
          // Vérifier le type MIME
          if (!blob.type.includes('pdf') && !blob.type.includes('application/octet-stream')) {
            console.warn('Unexpected MIME type:', blob.type);
          }
          
          this.pdfSrc = URL.createObjectURL(blob);
          console.log('PDF src URL created:', this.pdfSrc);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du PDF', err);
          this.toastService.show('Erreur lors du chargement du PDF', 'error');
          this.isLoading = false;
          this.hasError = true;
        }
      });
  }
  
  closeModal(): void {
    console.log('Closing PDF viewer modal');
    if (this.pdfSrc) {
      URL.revokeObjectURL(this.pdfSrc);
      this.pdfSrc = null;
    }
    this.close.emit();
  }
}