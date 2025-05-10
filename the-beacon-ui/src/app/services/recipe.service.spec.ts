import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecipeService } from './recipe.service';
import { Recipe } from '../model/recipe';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipeService]
    });

    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch recipes', (done) => {
    const mockRecipes: Recipe[] = [{
      id: 1,
      recipeId: 101,
      name: 'Whiskey Sour',
      ingredientId: 5,
      ingredientName: 'Whiskey',
      volumeMl: 60
    }];

    service.getRecipes().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].name).toBe('Whiskey Sour');
      done();
    });

    const req = httpMock.expectOne('http://localhost:5146/api/recipe');
    expect(req.request.method).toBe('GET');
    req.flush(mockRecipes);
  });
});
