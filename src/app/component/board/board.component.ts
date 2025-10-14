import { Component, inject, OnInit } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';
@Component({
  selector: 'app-board',
  imports: [CellComponent,CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {
   board:number[][]=[];

   boardService = inject(BoardService);
rowIndex: number;
colIndex: number;
  ngOnInit() {
    // Initialize a 9×9 board (81 cells)
    this.board = this.boardService.getBoard();
  console.log(this.board)

  }

 onCellInput(rowIndex: number, colIndex: number, event: any) {
  console.log({rowIndex, colIndex, event});
  const value = parseInt(event.target.value, 10) || 0;
  this.boardService.updateCell(rowIndex, colIndex, value);
}
}
