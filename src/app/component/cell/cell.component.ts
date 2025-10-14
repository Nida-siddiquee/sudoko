import { Component,EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cell',
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent {
   @Input() value: number | null = null;
  @Output() userInput = new EventEmitter<Event>();

  onInput(event: Event) {
    this.userInput.emit(event);
  }
}
