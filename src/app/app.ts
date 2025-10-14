import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoardComponent } from './component/board/board.component';
@Component({
  imports: [ RouterModule,BoardComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'sudoko';
}
