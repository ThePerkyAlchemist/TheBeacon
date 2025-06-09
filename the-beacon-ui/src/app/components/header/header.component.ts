import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  constructor(private router: Router) {}

  logout(): void {
    //removing the headervalue and navigates to login page:
    localStorage.removeItem('headerValue'); //clears the session
    this.router.navigate(['/login']); //routes the user to login screen
  }
}
