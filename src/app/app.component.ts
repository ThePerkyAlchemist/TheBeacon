import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StudentComponent } from "./student/student.component";
import { StudentListComponent } from "./student-list/student-list.component";

@Component({
  selector: 'app-root',
  imports: [ RouterLink, RouterOutlet, StudentComponent, StudentListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'apptest';
}
