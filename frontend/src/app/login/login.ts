import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Doctor } from '../services/doctor';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    private router: Router,
    private doctorService: Doctor

  ) { }

  errorMessage: string = '';

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z0-9 ]+$')
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
    ])
  })

  submit() {
    localStorage.clear();

    const username = this.loginForm.value.username?.trim();
    const password = this.loginForm.value.password?.trim();

    // ADMIN 
    if (username === 'admin' && password === 'Admin@123') {

    localStorage.setItem('role', 'ADMIN');
    localStorage.setItem('token', 'dummy');

    console.log("Admin login success");

    this.router.navigate(['/dashboard']);
    return;
  }

    // DOCTOR LOGIN - fetch all doctors and find match
    this.doctorService.getDoctorList().subscribe((doctors: any[]) => {

      const doctor = doctors.find(d =>
        d.fullName.toLowerCase() === username?.toLowerCase()
      );

      if (doctor && password === 'Doctor@123') {

        localStorage.setItem('role', 'DOCTOR');
        localStorage.setItem('doctorId', doctor.id.toString());
        localStorage.setItem('token', 'dummy');

        console.log("Logged in doctor:", doctor);

        this.router.navigate(['/doctor/dashboard']);

      } else {
        this.errorMessage = 'Invalid username or password';
      }

    });
  }
}
