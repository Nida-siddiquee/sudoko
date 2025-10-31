import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoardComponent } from './component/board/board.component';
import { RadioButton } from './component/radioButton/radioButton.component';
@Component({
  imports: [RouterModule, BoardComponent, RadioButton],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'sudoko';
  level: string | null = null;

  onLevelSelected(selectedLevel: string) {
    this.level = selectedLevel;
  }
}
