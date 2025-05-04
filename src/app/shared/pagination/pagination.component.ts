import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChanged.emit(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

  getVisiblePages(): number[] {
    const maxVisiblePages = 4;
    if (this.totalPages <= maxVisiblePages) {
      return Array.from({ length: this.totalPages }, (_, i) => i);
    }
    const visiblePages: number[] = [];
    
    if (this.currentPage < 2) {
      for (let i = 0; i < maxVisiblePages; i++) {
        visiblePages.push(i);
      }
    } else if (this.currentPage >= this.totalPages - 3) {
      for (let i = this.totalPages - maxVisiblePages; i < this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      visiblePages.push(this.currentPage);
      for (let i = 1; i < maxVisiblePages; i++) {
        visiblePages.push(this.currentPage + i);
      }
    }
    
    return visiblePages;
  }
}
