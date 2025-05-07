import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MatButtonModule],
  template: `
    <header style="display: flex; align-items: center; justify-content: space-between; padding: 1rem;">
      <img src="assets/theBeaconLogo4K.png" alt="The Beacon Logo" style="height: 60px;" />
      <button *ngIf="isAuthenticated()" (click)="logout()">Logout</button>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('headerValue');
  }

  logout(): void {
    localStorage.removeItem('headerValue');
    this.router.navigate(['/login']);
  }
}
