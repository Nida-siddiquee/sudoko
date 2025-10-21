import { Component, EventEmitter, Output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroup, FormControl, ReactiveFormsModule, } from '@angular/forms';
@Component({
  selector: 'app-radio-button',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radioButton.component.html',
  
})
export class RadioButton {
   form = new FormGroup({
    level: new FormControl('easy'),
  });
   @Output() level = new EventEmitter<string>();
  onSubmit() {
    const selectedLevel = this.form.get('level')?.value;
    this.level.emit(selectedLevel);
  }
}
