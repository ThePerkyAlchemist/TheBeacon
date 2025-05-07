import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../model/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseUrl = 'http://localhost:5146/api/stock'; // Justér hvis din endpoint er anderledes

  constructor(private http: HttpClient) {}
  authHeader: string = "Basic am9obi5kb2U6VmVyeVNlY3JldCE=";
  // GET all stock items
  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.baseUrl, {
      headers: {
        "Authorization": this.authHeader
      }
    });
  }

  // GET one stock item
  getById(id: number): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}/${id}`);
  }

  // POST new stock item
  add(stock: Partial<Stock>): Observable<any> {
    return this.http.post(this.baseUrl, stock);
  }

  // PUT update stock item
  update(stock: Stock): Observable<any> {
    return this.http.put(`${this.baseUrl}/${stock.id}`, stock);
  }

  // DELETE stock item
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
