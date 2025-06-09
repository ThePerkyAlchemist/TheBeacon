import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Angular Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username!: string;
  password!: string;
  authenticated = true;
  loginAttempted = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    //console.log('LoginComponent loaded');
  }

  login() {
  
    if (this.username && this.password) {
      this.auth.authenticate(this.username, this.password).subscribe({
        next: (response) => {
         // Stores the header in localStorage and navigates to /recipes:
          localStorage.setItem('headerValue', response.headerValue);
          this.router.navigate(['/recipes']);
        },
        error: () => {
          this.authenticated = false;
        }
      });
    }
  }
}
