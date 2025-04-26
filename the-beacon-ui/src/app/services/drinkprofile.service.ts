import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DrinkProfile } from '../model/drinkprofile';

@Injectable({
  providedIn: 'root'
})
export class DrinkProfileService {
  baseUrl = 'http://localhost:5146/api/drinkprofile';

  constructor(private http: HttpClient) {}

  getDrinkProfiles(): Observable<DrinkProfile[]> {
    return this.http.get<DrinkProfile[]>(this.baseUrl);
  }

  getDrinkProfile(id: number): Observable<DrinkProfile> {
    return this.http.get<DrinkProfile>(`${this.baseUrl}/${id}`);
  }

  createDrinkProfile(profile: Partial<DrinkProfile>): Observable<any> {
    return this.http.post(this.baseUrl, profile);
  }
  updateDrinkProfile(id: number, profile: DrinkProfile): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, profile);
  }

  deleteDrinkProfile(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
