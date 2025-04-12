import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidIngredientListComponent } from './liquid-ingredient-list.component';

describe('LiquidIngredientListComponent', () => {
  let component: LiquidIngredientListComponent;
  let fixture: ComponentFixture<LiquidIngredientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidIngredientListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiquidIngredientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
