import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board: number[][] = [];
  levels = { easy: 30, medium: 40, hard: 50, expert: 60, master: 65 };
  generatePuzzle(level: string) {
    this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.fillBoard();
    this.removeCells(this.levels[level]);
  }
  updateCell(row: number, col: number, value: number) {
    if (value >= 0 && value <= 9) {
      this.board[row][col] = value;
    }
  }
  getBoard(): number[][] {
    return this.board;
  }

  isValidInput(row: number, col: number, value: number): boolean {
    if (value < 1 || value > 9) {
      return false;
    }
    return this.isSafe(row, col, value);
  }

  validateInput(
    row: number,
    col: number,
    input: string
  ): { valid: boolean; value: number | null } {
    if (!/^[1-9]$/.test(input)) {
      return { valid: false, value: null };
    }
    const value = Number(input);
    if (this.isValidInput(row, col, value)) {
      return { valid: true, value };
    }
    return { valid: false, value: null };
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
    for (let i = 0; i < 9; i++) {
      if (this.board[row][i] === num || this.board[i][col] === num)
        return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[startRow + i][startCol + j] === num) return false;
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
