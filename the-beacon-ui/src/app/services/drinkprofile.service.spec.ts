import { TestBed } from '@angular/core/testing';

import { DrinkProfileService } from '../services/drinkprofile.service';

describe('DrinkprofileService', () => {
  let service: DrinkProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrinkProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
