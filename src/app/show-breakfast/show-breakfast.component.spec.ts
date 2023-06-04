import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBreakfastComponent } from './show-breakfast.component';

describe('ShowBreakfastComponent', () => {
  let component: ShowBreakfastComponent;
  let fixture: ComponentFixture<ShowBreakfastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowBreakfastComponent]
    });
    fixture = TestBed.createComponent(ShowBreakfastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
