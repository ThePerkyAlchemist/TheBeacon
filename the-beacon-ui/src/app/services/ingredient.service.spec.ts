import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IngredientService } from './ingredient.service';
import { Ingredient } from '../model/ingredient';

describe('IngredientService', () => {
  let service: IngredientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IngredientService]
    });

    service = TestBed.inject(IngredientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch ingredients', (done) => {
    const mockIngredients: Ingredient[] = [{
      id: 1,
      name: 'Gin',
      category: 'Spirit',
      subCategory: 'Dry Gin',
      barCodeString: '1234567890123',
      alcPercentage: 40
    }];

    service.getIngredients().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].name).toBe('Gin');
      done();
    });

    const req = httpMock.expectOne('http://localhost:5146/api/ingredient');
    expect(req.request.method).toBe('GET');
    req.flush(mockIngredients);
  });
});
