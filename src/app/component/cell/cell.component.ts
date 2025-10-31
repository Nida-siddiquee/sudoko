import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cell',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './cell.component.html',
})
export class CellComponent {
  @Input() value: number | null = null;
  @Input() isInvalid = false;
  @Output() userInput = new EventEmitter<string>();
  
  @Input() rowIndex!: number;
  @Input() colIndex!: number;

  onInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input === '' || /^[1-9]$/.test(input)) {
      this.userInput.emit(input);
    } else {
      // Reset invalid input
      (event.target as HTMLInputElement).value = this.value?.toString() || '';
    }
  }
}
