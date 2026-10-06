import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { Staff } from '../../services/staff';

@Component({
  selector: 'app-add-staff',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-staff.html',
  styleUrl: './add-staff.css',
})
export class AddStaffComponent implements OnInit{

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

  staffForm = new FormGroup({
    staffId: new FormControl(this.generateStaffId()),
    fullName: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    age: new FormControl<number | null>(null),
    mobileNumber: new FormControl('', [ 
      Validators.required,
      Validators.pattern('^[0-9]{10}$')]),
    role: new FormControl('', Validators.required),
    qualification: new FormControl('', Validators.required)
  })

  generateStaffId() {
    return 'STF-' + Math.floor(100 + Math.random() * 900);
  }

  constructor(
    private staffService: Staff,
    private cd: ChangeDetectorRef ) {
    this.staffForm.get('dateOfBirth')?.valueChanges.subscribe(dob => {
    if (dob) {
      const age = this.calculateAge(dob);
      this.staffForm.get('age')?.setValue(age);
    }
  });
  }

  

  roles = [
    "Nurse",
    "Receptionist",
    "Pharmacist",
    "Lab Technician",
    "Security",
    "Peon"
  ]

  qualifications: string[] = [];

  roleData: any = {
    Nurse: {
      qualifications: [ 'B.Sc Nursing', 'GNM', 'ANM' ]
    },
    Receptionist: {
      qualifications: [ 'Graduate' ]
    },
    Pharmacist: {
      qualifications: [ 'D.Pharm', 'B.Pharm' ]
    },
    'Lab Technician': {
      qualifications: ['DMLT', 'BMLT']
    },
    Security: {
      qualifications: ['Graduate', '12th Pass', '10th Pass']
    },
    Peon: {
      qualifications: ['Graduate', '12th Pass', '10th Pass']
    }
  }

  ngOnInit() {

    this.staffForm.get('role')?.valueChanges.subscribe(role => {
    
      if(role) {
        this.qualifications = this.roleData[role]?.qualifications || [];
      } else {
        this.qualifications = [];
      }

      this.staffForm.patchValue({
        qualification: ''
      })
    })
  }

  submit() {
    if (this.staffForm.invalid) {
      return;
    }

    this.staffService.getStaffFormData(this.staffForm.getRawValue()).subscribe({
      next: (response: any) => {
        console.log(response.staffForm);
        this.staffForm.reset({
          staffId: this.generateStaffId(),
          fullName: '',
          gender: '',
          dateOfBirth: '',
          age: null,
          mobileNumber: ''
        });
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
    
}

