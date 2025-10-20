import { Component, inject, Input, OnInit } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';
@Component({
  selector: 'app-board',
  imports: [CellComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {
  @Input() level: string | null = null;
  board: number[][] = [];
  boardService = inject(BoardService);
  ngOnInit() {
    // Initialize a 9×9 board (81 cells)
    this.boardService.generatePuzzle(this.level);
    this.board = this.boardService.getBoard();
    console.log(this.board);
  }

 onCellInput(rowIndex: number, colIndex: number, input: string) {
  const { valid, value } = this.boardService.validateInput(rowIndex, colIndex, input);
  const boardValue = valid ? value : null;

  this.boardService.updateCell(rowIndex, colIndex, boardValue || 0);

  const cellComponent = document.querySelectorAll('app-cell')[rowIndex * 9 + colIndex] as HTMLElement & { isInvalid?: boolean };
  if (cellComponent) {
    cellComponent.isInvalid = !valid;
  }
}
}
