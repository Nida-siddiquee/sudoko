import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board: number[][] = [];
  initialBoard: number[][] = [];
  solutionBoard: number[][] = [];
  levels = { easy: 30, medium: 40, hard: 50, expert: 60, master: 65 };

  generatePuzzle(level: string) {
    // Check for saved progress
    const saved = localStorage.getItem(`sudoku-${level}`);
    if (saved) {
      const data = JSON.parse(saved);
      this.board = data.board;
      this.solutionBoard = data.solutionBoard;
      this.initialBoard = data.initialBoard;
      console.log('Loaded saved progress from localStorage');
      return;
    }

    // Generate new solvable puzzle
    this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.fillBoard(); // fill completely
    this.solutionBoard = this.board.map((row) => [...row]); // save solution
    this.removeCells(this.levels[level]); // remove cells for difficulty
    this.initialBoard = this.board.map((row) => [...row]);

    this.saveProgress(level);
  }

  saveProgress(level: string) {
    localStorage.setItem(
      `sudoku-${level}`,
      JSON.stringify({
        board: this.board,
        initialBoard: this.initialBoard,
        solutionBoard: this.solutionBoard,
      })
    );
  }

  clearProgress(level: string) {
    localStorage.removeItem(`sudoku-${level}`);
  }

  getBoard(): number[][] {
    return this.board.map((row) => [...row]);
  }

  updateCell(row: number, col: number, value: number) {
    if (value >= 0 && value <= 9) {
      this.board[row][col] = value;
    }
  }

  resetBoard() {
    this.board = this.initialBoard.map((row) => [...row]);
  }

  solveBoard() {
    this.board = this.solutionBoard.map((row) => [...row]);
  }

  isBoardComplete(board: number[][]): boolean {
    return board.every((row) => row.every((cell) => cell !== 0));
  }

  isBoardSolved(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] !== this.solutionBoard[row][col]) return false;
      }
    }
    return true;
  }

  validateInput(
    row: number,
    col: number,
    input: string
  ): { valid: boolean; value: number | null } {
    if (!/^[1-9]$/.test(input)) return { valid: false, value: null };
    const value = Number(input);
    return { valid: this.isSafe(row, col, value), value };
  }

  onHintRequested(): { row: number; col: number; value: number; reason: string } | null {
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) emptyCells.push({ row, col });
      }
    }

    if (emptyCells.length === 0) return null;

    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = this.solutionBoard[row][col];
    this.board[row][col] = value;

    const reasons = [
      'This number uniquely fits in its 3×3 box.',
      'No other number fits here without breaking Sudoku rules.',
      'This cell was deduced from its row and column constraints.',
      'Only this value keeps the board solvable at this stage.',
    ];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    return { row, col, value, reason };
  }

  private fillBoard(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) {
          const numbers = this.shuffle([...Array(9)].map((_, i) => i + 1));
          for (const num of numbers) {
            if (this.isSafe(row, col, num)) {
              this.board[row][col] = num;
              if (this.fillBoard()) return true;
              this.board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private isSafe(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (this.board[row][i] === num && i !== col) return false;
      if (this.board[i][col] === num && i !== row) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if (this.board[r][c] === num && (r !== row || c !== col)) return false;
      }
    }
    return true;
  }

  private shuffle(arr: number[]): number[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private removeCells(count: number) {
    while (count > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (this.board[row][col] !== 0) {
        this.board[row][col] = 0;
        count--;
      }
    }
  }
}
