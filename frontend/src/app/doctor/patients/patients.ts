import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../services/appointment';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients.html',
  styleUrls: ['./patients.css']
})
export class DoctorPatientsComponent implements OnInit {

  doctorId = Number(localStorage.getItem('doctorId'));

  patients: any[] = [];

  constructor(private appointmentService: Appointment) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients() {
    this.appointmentService.getAllAppointment().subscribe((data: any[]) => {

      // Filter doctor appointments
      const doctorAppointments = data.filter(
        a => Number(a.doctorId) === this.doctorId
      );

      // Extract unique patients
      const uniqueMap = new Map();

      doctorAppointments.forEach(appt => {
        if (!uniqueMap.has(appt.patientName)) {
          uniqueMap.set(appt.patientName, appt);
        }
      });

      this.patients = Array.from(uniqueMap.values());

      console.log("Doctor Patients:", this.patients);
    });
  }
}