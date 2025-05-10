import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DrinkProfileService } from './drinkprofile.service';
import { DrinkProfile } from '../model/drinkprofile';

describe('DrinkProfileService', () => {
  let service: DrinkProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DrinkProfileService]
    });

    service = TestBed.inject(DrinkProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch drink profiles', (done) => {
    const mockData: DrinkProfile[] = [{
      id: 1,
      recipeId: 1,
      description: 'Smooth and citrusy',
      sweetnessOrFruitiness: 4,
      richness: 3,
      booziness: 2,
      sourness: 2,
      freshness: 5,
      lightness: 3,
      timestamp: new Date().toISOString()
    }];

    service.getDrinkProfiles().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].description).toBe('Smooth and citrusy');
      done();
    });

    const req = httpMock.expectOne('http://localhost:5146/api/drinkprofile');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
