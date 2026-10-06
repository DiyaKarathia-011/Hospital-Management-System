import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl,Validators, ReactiveFormsModule } from '@angular/forms';
import { Appointment } from '../../services/appointment';
import { PatientsService } from '../../services/patients.service';
import { Router } from '@angular/router';
import { Doctor } from '../../services/doctor';
import { Department } from '../../services/department';


@Component({
  selector: 'app-add-appoitment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-appoitment.html',
  styleUrl: './add-appoitment.css',
})
export class AddAppoitment implements OnInit{

  constructor(
    private appointmentService: Appointment,
    private patientsService: PatientsService,
    private router: Router,
    private doctorService: Doctor,
    private departmentService: Department
  ) {}

  appointmentForm = new FormGroup({
    appointmentId: new FormControl(this.generateAppointmentId()),

    patientName: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    doctor: new FormControl('', Validators.required),

    appointmentDate: new FormControl('', Validators.required),
    appointmentTime: new FormControl('', Validators.required),

    consultationType: new FormControl('', Validators.required),

    appointmentStatus: new FormControl('', Validators.required),
    paymentStatus: new FormControl('', Validators.required)
  })

  generateAppointmentId() {
    return 'API-' + Math.floor(100 + Math.random() * 900);
  }

  patient: any[] =[];
  doctors: any[] =[];
  selectedDoctor: any;
  filteredDoctors: any[] =[];
  departments: string[] =[];

  ngOnInit(): void {
    this.patientsService.getAllPatients().subscribe(data => {
      this.patient = data;
    })
    this.doctorService.getDoctorList().subscribe({
      next: (data) => {
        this.doctors = data;
        console.log(data);

        this.departments = [...new Set(data.map(d => d.specialization))];
        console.log(this.departments);

      }
    })

    this.appointmentForm.get('department')?.valueChanges.subscribe(dept => {
      if(!dept) {
        this.filteredDoctors = [];
        return;
      }
      this.filteredDoctors = this.doctors.filter(
        d => d.specialization === dept
      )

      console.log(this.filteredDoctors);

    })
    
  }

  onDoctorSelect(event: any) {
  const selectedId = Number(event.target.value);

  this.selectedDoctor = this.doctors.find(d => d.id === selectedId);
}

  submit() {
  if (this.appointmentForm.invalid) return;

  // 🔥 IMPORTANT: attach doctorId
  const formData = {
    ...this.appointmentForm.value,

    doctor: this.selectedDoctor?.fullName, // display name
    doctorId: this.selectedDoctor?.id      // 🔥 REQUIRED for filtering
  };

  console.log("Final Data:", formData);

  this.appointmentService.addAppointment(formData).subscribe(res => {
    console.log(res);

    this.router.navigate(['/appointments']);

    this.appointmentForm.reset({
      appointmentId: this.generateAppointmentId(),
      patientName: '',
      department: '',
      doctor: '',
      appointmentDate: '',
      appointmentTime: '',
      consultationType: '',
      appointmentStatus: '',   
      paymentStatus: ''
    });
  });

  alert('Appointment added successfully!');
}
}
