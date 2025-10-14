import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  board:number[][] = [];
  constructor() {
    this.resetBoard();
  }

  resetBoard() {
    this.board = Array.from({length:9},()=>Array(9).fill(0));

  }

  updateCell(row: number, col: number, value: number) {
    this.board[row][col] = value;
  }

  getBoard(){
    return this.board
  }

}
