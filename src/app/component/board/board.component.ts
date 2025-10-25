import { Component, inject, Input, OnInit } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';
import { Button } from '../button/button';
@Component({
  selector: 'app-board',
  imports: [CellComponent, CommonModule, Button],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {
  @Input() level: string | null = null;
  board: number[][] = [];
  boardService = inject(BoardService);
  numbers = Array.from({ length: 9 }, (_, i) => i + 1);
  colIndex: number | null = null;
  rowIndex: number | null = null;
  
  
  ngOnInit() {
    // Initialize a 9×9 board (81 cells)
    this.boardService.generatePuzzle(this.level);
    this.board = this.boardService.getBoard();
    console.log(this.board);
  }
  resetBoard() {
    this.board = this.boardService.resetBoard();
  }
  solveBoard() {
    this.boardService.solveBoard();
    this.board = this.boardService.getBoard();
    // Implement solve logic if needed
  }
  onNumberSelected(  number: number) {
    if(!this.rowIndex && !this.colIndex) return;
   this.boardService.onNumberSelected(number);
  }
  onCellInput(rowIndex: number, colIndex: number, input: string) {
    console.log('Cell input received in board:', {
      rowIndex,
      colIndex,
      input,
    });
    const { valid, value } = this.boardService.validateInput(
      rowIndex,
      colIndex,
      input
    );
    const boardValue = valid ? value : null;

    this.boardService.updateCell(rowIndex, colIndex, boardValue || 0);
    const cellComponent = document.querySelectorAll('app-cell')[
      rowIndex * 9 + colIndex
    ] as HTMLElement & { isInvalid?: boolean };
    if (cellComponent) {
      cellComponent.isInvalid = !valid;
      console.log({ valid, value, cellComponent });
    }
  }
}
