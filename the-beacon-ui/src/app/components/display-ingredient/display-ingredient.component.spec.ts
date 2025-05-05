import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayIngredientComponent } from './display-ingredient.component';

describe('DisplayIngredientComponent', () => {
  let component: DisplayIngredientComponent;
  let fixture: ComponentFixture<DisplayIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayIngredientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
