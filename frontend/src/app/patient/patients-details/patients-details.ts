import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsService } from '../../services/patients.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Appointment } from '../../services/appointment';


@Component({
  selector: 'app-patients-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients-details.html',
  styleUrl: './patients-details.css',
})
export class PatientsDetailsComponent implements OnInit {
  
  patient: any;
  appointment: any[] = [];
  patientVisits: any[] = [];

  constructor(
    private patientsService: PatientsService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router,
    private appointmentService: Appointment
  ) {}

  ngOnInit() {

  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    
    if (id) {
      this.patientsService.getPatientById(id).subscribe({
        next: (data) => {
          this.patient = data;
          this.cd.detectChanges();
        },
        error: (err) => console.error(err)
      });
    }
  });

  this.appointmentService.getAllAppointment().subscribe(data =>{
    this.appointment = data;
    this.patientVisits = this.appointment.filter(
      a => a.patientName === this.patient.fullName
    )
    console.log("Patient Visits:", this.patientVisits);
    
  })
}

update() {
  this.patientsService.updatePatient(this.patient).subscribe({
    next: () => {
      alert("Updated successfully");
    },
    error: err => console.error(err)
  });
}

delete() {
  if(!confirm("Delete this patient?")) return;

  this.patientsService.deletePatient(this.patient.id).subscribe({
    next: () => {
      alert("Deleted Successfully");
      this.router.navigate(['/showallpatients']);
    },
    error: err => console.error(err)
  })
  }

}
