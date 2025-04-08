import { Component, Input } from '@angular/core';
import { Student } from '../model/student';

@Component({
  selector: 'app-student',
  imports: [],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
// It’s important to fill out all properties if they are not nullables
mode = 0; // 0 will display div mode, 1 will display table mode
  @Input() student?: Student = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    studyProgram: 1,
    dob: new Date(2000, 1, 1),
    email: 'jane.doe@mailinator.com',
    phone: '+4511111111'
    }
}
