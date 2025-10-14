import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cell',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent {
  @Input() value: number | null = null;
  @Output() userInput = new EventEmitter<string>();
  @Input() isInvalid = false;


  onInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.userInput.emit(input);
  }
}