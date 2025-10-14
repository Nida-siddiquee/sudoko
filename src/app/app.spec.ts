import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
 
  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to Sudoko!'
    );
  });
});
