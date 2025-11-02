import { Component, inject, Input, OnInit } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';
import { Button } from '../button/button';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-board',
  imports: [CellComponent, CommonModule, Button],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  @Input() level: string | null = null;
  board: number[][] = [];
  invalidCells: boolean[][] = Array(9)
    .fill([])
    .map(() => Array(9).fill(false));
  boardService = inject(BoardService);
  numbers = Array.from({ length: 9 }, (_, i) => i + 1);
  selectedColIndex: number | null = null;
  selectedRowIndex: number | null = null;

  ngOnInit() {
    // Initialize a 9×9 board (81 cells)
    this.boardService.generatePuzzle(this.level || 'easy');
    this.board = this.boardService.getBoard();
    console.log(this.board);
  }
  resetBoard() {
    this.boardService.resetBoard();
    this.board = this.boardService.getBoard();
    console.log(this.board);
  }
  solveBoard() {
    this.boardService.solveBoard();
    this.board = this.boardService.getBoard();
    // Implement solve logic if needed
  }

  hintMessage = '';
highlightedCell: { row: number; col: number } | null = null;
triggerConfetti() {
  // Fire a short burst from multiple angles
  const duration = 4000;
  const end = Date.now() + duration;

  const colors = ['#6F4E37', '#F6E3D3', '#FFF3E9', '#3A291C'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  this.hintMessage = '🎉 Congratulations! You completed the puzzle!';
}

requestHint() {
  const hint = this.boardService.onHintRequested();
  if (!hint) {
    this.hintMessage = 'No hints available — the board is already solved!';
    return;
  }

  this.highlightedCell = { row: hint.row, col: hint.col };
  this.hintMessage = `Hint: ${hint.reason}`;

  // Remove highlight after 2 seconds
  setTimeout(() => (this.highlightedCell = null), 2000);
}
  // select a cell when clicked in the template
  selectCell(row: number, col: number) {
    this.selectedRowIndex = row;
    this.selectedColIndex = col;
  }

  onNumberSelected(number: number) {
    if (this.selectedRowIndex === null || this.selectedColIndex === null)
      return;
    const r = this.selectedRowIndex;
    const c = this.selectedColIndex;

    if (this.boardService.board[r][c]) {
      const { valid } = this.boardService.validateInput(
        r,
        c,
        this.boardService.board[r][c].toString()
      );
      if (valid) {
        return;
      }
    }
    // Always update the cell with the number
    this.boardService.updateCell(r, c, number);

    // Check if it's valid
    const { valid } = this.boardService.validateInput(r, c, number.toString());
if (this.boardService.isBoardComplete() && valid) {
    this.triggerConfetti();
  }
    // Update invalid cells array
    this.invalidCells[r][c] = !valid;

    // Update the board display
    this.board = this.boardService.getBoard();
  }

  onCellInput(rowIndex: number, colIndex: number, input: string) {
    this.selectedRowIndex = rowIndex;
    this.selectedColIndex = colIndex;

    // Convert input to number or use 0 if invalid
    const number = parseInt(input) || 0;

    // Always update the cell
    this.boardService.updateCell(rowIndex, colIndex, number);

    // Check if it's valid
    const { valid } = this.boardService.validateInput(
      rowIndex,
      colIndex,
      input
    );

    // Update invalid cells array
    this.invalidCells[rowIndex][colIndex] = !valid;
  if (this.boardService.isBoardComplete() && valid) {
    this.triggerConfetti();
  }
    // Update the board display
    this.board = this.boardService.getBoard();
  }
}
