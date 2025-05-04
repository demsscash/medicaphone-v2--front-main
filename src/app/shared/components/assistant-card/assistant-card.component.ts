import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Assistant } from '../../../core/models/assistant';

@Component({
  selector: 'app-assistant-card',
  templateUrl: './assistant-card.component.html',
  styleUrls: ['./assistant-card.component.scss']
})
export class AssistantCardComponent {
  @Input() assistant!: Assistant;
  @Input() isDoctor: boolean = false;
  @Output() associerClick = new EventEmitter<Assistant>();

  onAssocier(): void {
    this.associerClick.emit(this.assistant);
  }
}
