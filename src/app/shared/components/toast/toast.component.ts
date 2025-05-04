import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="toast" [ngClass]="type">
      <i [class]="getIconClass()"></i>
      <span>{{ message }}</span>
      <div class="progress-bar"></div>
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  getIconClass(): string {
    return this.type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }
}
