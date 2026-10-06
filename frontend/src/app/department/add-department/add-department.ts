import { Component } from '@angular/core';
import { Department } from '../../services/department';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-department',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-department.html',
  styleUrl: './add-department.css',
})
export class AddDepartment {

  constructor(
    private departmentService: Department,
    private router: Router
  ) {}

  addDepartment = new FormGroup({

    departmentId: new FormControl(this.generateId()),
    
    departmentName: new FormControl('', Validators.required),

    description: new FormControl('', Validators.required)

  })

  generateId() {
    return 'DEP-' + Math.floor(100 + Math.random() * 900);
  }

  submit() {
    if(this.addDepartment.invalid) {
      return;
    }

    this.departmentService.addDepartment(this.addDepartment.getRawValue()).subscribe({
      next: () => {

        alert('Department added successfully!');

        this.router.navigate(['/department']);
      },
      error: (err) => console.error(err)
    })
    
  }
}
