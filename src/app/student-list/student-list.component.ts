import { Component } from '@angular/core';
import { Student } from '../model/student';
import { StudentComponent } from "../student/student.component";


@Component({
  selector: 'app-student-list',
  imports: [StudentComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  students: Student[] = [
    {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      studyProgram: 1,
      dob: new Date(2000, 1, 1),
      email: 'jane.doe@mailinator.com',
      phone: '+4511111111'
    },
    {
      id: 2,
      firstName: "Super",
      lastName: "Man",
      studyProgram: 2,
      dob: new Date(2002, 2, 28),
      email: "super.man@mailinator.com",
      phone: "+4522222222"
    },
    {
      id: 3,
      firstName: "Super",
      lastName: "Woman",
      studyProgram: 1,
      dob: new Date(2001, 7, 1),
      email: "super.woman@mailinator.com",
      phone: "+4533333333"
    }
  ];

}
