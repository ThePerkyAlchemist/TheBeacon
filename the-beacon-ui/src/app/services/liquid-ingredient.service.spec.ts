import { TestBed } from '@angular/core/testing';

import { LiquidIngredientService } from './liquid-ingredient.service';

describe('LiquidIngredientService', () => {
  let service: LiquidIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiquidIngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
