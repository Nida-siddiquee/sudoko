import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board: number[][] = [];
  initialBoard: number[][] = [];
  solutionBoard: number[][] = [];

  levels = { easy: 30, medium: 40, hard: 50, expert: 60, master: 65 };
isBoardComplete(): boolean {
  return this.board.every(row => row.every(cell => cell !== 0));
}
  generatePuzzle(level: string) {
    this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.fillBoard();
    this.solutionBoard = this.board.map((row) => [...row]);
    this.removeCells(this.levels[level]);
    this.initialBoard = this.board.map((row) => [...row]);
  }
  updateCell(row: number, col: number, value: number) {
    if (value >= 0 && value <= 9) {
      this.board[row][col] = value;
    }
  }
  getBoard(): number[][] {
    // this.initialBoard = this.board.map((row) => [...row]);
    console.log('Initial Board Set:', this.initialBoard, this.board);
    return this.board;
  }

  isValidInput(row: number, col: number, value: number): boolean {
    if (value < 1 || value > 9) {
      return false;
    }
    console.log(`isValidInput ${value} at (${row}, ${col})`);
    return this.isSafe(row, col, value);
  }

  resetBoard() {
    console.log('Resetting board to initial state:', this.initialBoard);
    return (this.board = this.initialBoard.map((row) => [...row]));
  }

  solveBoard() {
    console.log('Solving board in service', this.solutionBoard);
    return (this.board = this.solutionBoard.map((row) => [...row]));
  }
  validateInput(
    row: number,
    col: number,
    input: string
  ): { valid: boolean; value: number | null } {
    if (!/^[1-9]$/.test(input)) {
      console.log(`Invalid input ${input} at (${row}, ${col}) in service`);
      return { valid: false, value: null };
    }
    const value = Number(input);
    console.log(
      `Validating input ${this.isValidInput(
        row,
        col,
        value
      )},${value} in service`
    );

    if (this.isValidInput(row, col, value)) {
      return { valid: true, value };
    }
    return { valid: false, value: null };
  }

  onNumberSelected(number: number) {
    console.log(`Number ${number} selected in service`);
  }

  onHintRequested(): { row: number; col: number; value: number; reason: string } | null {
  console.log('Hint requested in service');

  const emptyCells: { row: number; col: number }[] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (this.board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length === 0) {
    console.log('No empty cells left.');
    return null;
  }

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = this.solutionBoard[row][col];
  this.board[row][col] = value;

  // Pick a random educational reason (optional)
  const reasons = [
    'This number uniquely fits in its 3×3 box.',
    'No other number fits here without breaking Sudoku rules.',
    'This cell was deduced from its row and column constraints.',
    'Only this value keeps the board solvable at this stage.'
  ];
  const reason = reasons[Math.floor(Math.random() * reasons.length)];

  console.log(`Hint: Placed ${value} at (${row}, ${col}). Reason: ${reason}`);

  return { row, col, value, reason };
}


  private fillBoard(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) {
          const numbers = this.shuffle(
            Array.from({ length: 9 }, (_, i) => i + 1)
          );
          for (const num of numbers) {
            if (this.isSafe(row, col, num)) {
              this.board[row][col] = num;
              if (this.fillBoard()) {
                return true;
              }
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
    // Check row and column excluding current cell
    for (let i = 0; i < 9; i++) {
      if (
        (this.board[row][i] === num && i !== col) ||
        (this.board[i][col] === num && i !== row)
      ) {
        return false;
      }
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    // Check the 3x3 box
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if (this.board[r][c] === num && (r !== row || c !== col)) {
          return false;
        }
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
