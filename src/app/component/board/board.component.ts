import { Component, inject, OnInit } from '@angular/core';
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
  board: number[][] = [];
  boardService = inject(BoardService);
  ngOnInit() {
    // Initialize a 9×9 board (81 cells)
    this.board = this.boardService.getBoard();
    console.log(this.board);
  }

onCellInput(rowIndex: number, colIndex: number, input: string) {
  const { valid, value } = this.boardService.validateInput(rowIndex, colIndex, input);
  const boardValue = valid ? value : null;

  this.boardService.updateCell(rowIndex, colIndex, boardValue || 0);

  // set invalid flag only on that cell
  const cellComponent = document.querySelectorAll('app-cell')[rowIndex * 9 + colIndex] as any;
  if (cellComponent) {
    cellComponent.isInvalid = !valid;
  }
}
}
