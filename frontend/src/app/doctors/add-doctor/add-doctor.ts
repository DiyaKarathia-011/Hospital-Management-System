import { Component} from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule} from '@angular/common';
import { Doctor } from '../../services/doctor';


@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-doctor.html',
  styleUrl: './add-doctor.css',
})
export class AddDoctorComponent  {

  calculateAge(dob: string):number {
    const birthday = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    if(monthDiff<0 || monthDiff === 0 && today.getDate()<birthday.getDate()) {
      age --;
    }

    return age;
  }

  doctorForm = new FormGroup({

    doctorId: new FormControl(this.generateDoctorId()),

    fullName: new FormControl('', Validators.required),

    gender: new FormControl('', Validators.required),

    dateOfBirth: new FormControl('', Validators.required),
    age: new FormControl<number | null>(null),

    mobileNumber: new FormControl('', [ 
      Validators.required,
      Validators.pattern('^[0-9]{10}$')]),

    email: new FormControl('', [
      Validators.required, 
      Validators.email]),

    qualification: new FormControl('', Validators.required),

    specialization: new FormControl('', Validators.required),

    experience: new FormControl('', [
      Validators.required,
      Validators.min(0)])
  })

  generateDoctorId() {
    return 'DOC-' + Math.floor(100 + Math.random() * 900);
  }
  
  constructor(private doctorService: Doctor) {
    this.doctorForm.get('dateOfBirth')?.valueChanges.subscribe(dob => {
    if (dob) {
      const age = this.calculateAge(dob);
      this.doctorForm.get('age')?.setValue(age);
    }
  });
  }

  submit() {
    if(this.doctorForm.invalid) {
      return;
    }

    this.doctorService.getDoctorFormData(this.doctorForm.getRawValue()).subscribe({
      next: (response: any) => {
        console.log(response.doctor);
        this.doctorForm.reset({
          doctorId: this.generateDoctorId(),
          fullName: '',
          gender: '',
          dateOfBirth: '',
          age: null,
          mobileNumber: '',
          email: '',
          qualification: '',
          specialization: '',
          experience: ''
        })
      },
      error: (err) => {
        console.error(err);
      }
    })
    alert('Doctor added successfully!');
  }

}
