import { Component, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generic-list',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './generic-document-list.component.html',
  styleUrls: ['./generic-document-list.component.scss']
})
export class GenericDocumentListComponent {
  @Input() title: string = 'Documents';
  @Input() documents: any[] = [];
  @Input() filteredDocuments: any[] = [];
  @Input() columns: {key: string, label: string}[] = [
    {key: 'nom', label: 'Document'},
    {key: 'creationDate', label: 'Date'}
  ];
  @Input() showDownload: boolean = true;
  loading: boolean = true;
  @Output() search = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();
  @Output() view = new EventEmitter<any>();
  @Output() download = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documents']) {
      this.loading = false; 
      if (!this.filteredDocuments?.length && this.documents?.length) {
        this.filteredDocuments = [...this.documents];
      }
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.emit(input.value);
  }
}
