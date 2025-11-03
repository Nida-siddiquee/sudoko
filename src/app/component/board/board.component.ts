import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
  @Output() changeLevel = new EventEmitter<void>(); // Notify parent to go back

  board: number[][] = [];
  invalidCells: boolean[][] = Array.from({ length: 9 }, () =>
    Array(9).fill(false)
  );

  boardService = inject(BoardService);
  numbers = Array.from({ length: 9 }, (_, i) => i + 1);
  selectedColIndex: number | null = null;
  selectedRowIndex: number | null = null;
  hintMessage = '';
  highlightedCell: { row: number; col: number } | null = null;
  showWinModal = false;
  ngOnInit() {
    this.boardService.generatePuzzle(this.level || 'easy');
    this.board = this.boardService.getBoard();
  }

  resetBoard() {
    this.boardService.resetBoard();
    this.board = this.boardService.getBoard();
    this.hintMessage = 'Board has been reset!';
    this.boardService.clearProgress(this.level || 'easy');
  }

  solveBoard() {
    this.boardService.solveBoard();
    this.board = this.boardService.getBoard();
    this.hintMessage = 'The puzzle has been solved!';
    this.triggerConfetti();
  }

 checkForCompletion() {
    if (
      this.boardService.isBoardComplete(this.board) &&
      this.boardService.isBoardSolved()
    ) {
      this.handleWin();
    }
  }

  handleWin() {
    this.triggerConfetti();
    this.hintMessage = '🎉 Congratulations! You completed the Sudoku!';
    this.boardService.clearProgress(this.level || 'easy');

    setTimeout(() => {
      this.showWinModal = true; // Show popup after confetti
    }, 4000);
  }

  requestHint() {
    const hint = this.boardService.onHintRequested();
    if (!hint) {
      this.hintMessage = 'No hints available — the board is already solved!';
      return;
    }

    this.highlightedCell = { row: hint.row, col: hint.col };
    this.hintMessage = `Hint: ${hint.reason}`;
    this.board = this.boardService.getBoard();
    this.boardService.saveProgress(this.level || 'easy');
    this.checkForCompletion();

    setTimeout(() => (this.highlightedCell = null), 2000);
  }

  selectCell(row: number, col: number) {
    this.selectedRowIndex = row;
    this.selectedColIndex = col;
  }

  onNumberSelected(number: number) {
    if (this.selectedRowIndex === null || this.selectedColIndex === null)
      return;
    const r = this.selectedRowIndex;
    const c = this.selectedColIndex;

    this.boardService.updateCell(r, c, number);
    const { valid } = this.boardService.validateInput(r, c, number.toString());
    this.invalidCells[r][c] = !valid;

    this.board = this.boardService.getBoard();
    this.boardService.saveProgress(this.level || 'easy');
    this.checkForCompletion();
  }

  onCellInput(rowIndex: number, colIndex: number, input: string) {
    this.selectedRowIndex = rowIndex;
    this.selectedColIndex = colIndex;

    const number = parseInt(input) || 0;
    this.boardService.updateCell(rowIndex, colIndex, number);

    const { valid } = this.boardService.validateInput(
      rowIndex,
      colIndex,
      input
    );
    this.invalidCells[rowIndex][colIndex] = !valid;

    this.board = this.boardService.getBoard();
    this.boardService.saveProgress(this.level || 'easy');
    this.checkForCompletion();
  }

  triggerConfetti() {
    const duration = 3000;
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
        spread: 360,
        ticks: 60,
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
  startNewGame() {
    this.showWinModal = false;
    this.boardService.clearProgress(this.level || 'easy');
    this.boardService.generatePuzzle(this.level || 'easy');
    this.board = this.boardService.getBoard();
    this.hintMessage = 'New puzzle started!';
  }

  onChangeLevelClick() {
    this.showWinModal = false;
    this.changeLevel.emit();
  }
}
