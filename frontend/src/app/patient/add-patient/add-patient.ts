import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientsService } from '../../services/patients.service';


@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css',
})
export class AddPatientComponent {

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

  patientForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    age: new FormControl<number | null>(null),
    bloodGroup: new FormControl('', Validators.required),
    mobileNumber: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  })

  constructor(private patientsService: PatientsService) {
    this.patientForm.get('dateOfBirth')?.valueChanges.subscribe(dob => {
    if (dob) {
      const age = this.calculateAge(dob);
      this.patientForm.get('age')?.setValue(age);
    }
  });

  }

  submitForm() {
    if(this.patientForm.invalid) {
      return;
    }

  this.patientsService.getPatientsFormData(this.patientForm.value).subscribe({
    next: (response: any) => {
      console.log(response.patient);
      this.patientForm.reset({
        fullName: '',
        gender: '',
        dateOfBirth: '',
        age: null,
        bloodGroup: '',
        mobileNumber: '',
        address: ''
      }); 

    },

    error: (err) => {
      console.error(err);
    }
  });
}
}
