import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient } from  '../model/ingredient';



@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  apiUrl = 'http://localhost:5146/api/ingredient'; //This is an absolute safety violation in the long run. 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl);
  }
  update(ingredient: Ingredient) {
    return this.http.put(`${this.apiUrl}/${ingredient.id}`, ingredient);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  add(ingredient: Ingredient) {
    return this.http.post(this.apiUrl, ingredient); // <-- Tilføjet
  }
}


