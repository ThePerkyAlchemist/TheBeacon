import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LiquidIngredient } from  '../model/liquidingredient';



@Injectable({
  providedIn: 'root'
})
export class LiquidIngredientService {
  apiUrl = 'http://localhost:5146/api/liquidingredient'; //This is an absolute safety violation in the long run. 

  constructor(private http: HttpClient) {}

  getAll(): Observable<LiquidIngredient[]> {
    return this.http.get<LiquidIngredient[]>(this.apiUrl);
  }
  update(ingredient: LiquidIngredient) {
    return this.http.put(`${this.apiUrl}/${ingredient.id}`, ingredient);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  add(ingredient: LiquidIngredient) {
    return this.http.post(this.apiUrl, ingredient); // <-- Tilføjet
  }
}


