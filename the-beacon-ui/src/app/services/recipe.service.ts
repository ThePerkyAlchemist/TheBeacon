import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from  '../model/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  baseUrl: string = "http://localhost:5057/api";
  constructor(private http: HttpClient) { }

  getRecipes():Observable<Recipe[]>{
    return this.http.get<Recipe[]>('${this.baseUrl}/recipe');
  }

  getRecipeByID(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/recipe/${id}`);
  }

  createRecipe(student: Recipe): Observable<any> {
    return this.http.post(`${this.baseUrl}/recipe`, student);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/recipe/${id}`);
  }
}
