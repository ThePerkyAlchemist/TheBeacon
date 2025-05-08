import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../model/login';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = "http://localhost:5146/api";
  constructor(private http: HttpClient) {
  }
  authenticate(username: String, password: String): Observable<Login> {
    return this.http.post<Login>(`${this.baseUrl}/login`, {
      username: username,
      password: password
    });
  }
  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('headerValue');
  }
}