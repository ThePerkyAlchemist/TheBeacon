import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from  '../model/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  baseUrl: string = "http://localhost:5146/api";
  constructor(private http: HttpClient) { }

  getRecipes():Observable<Recipe[]>{
    return this.http.get<Recipe[]>(`${this.baseUrl}/recipe`);
  }

  getRecipeByID(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/recipe/${id}`);
  }

  createRecipe(recipe: Recipe): Observable<any> {
    return this.http.post(`${this.baseUrl}/recipe`, recipe);
  }

  updateRecipe(id: number, recipe: Recipe): Observable<any> {
    return this.http.put(`${this.baseUrl}/recipe/${id}`, recipe);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/recipe/${id}`);
  }
}
