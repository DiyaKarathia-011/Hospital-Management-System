import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../services/appointment';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css']
})
export class DoctorAppointmentsComponent implements OnInit {

  doctorId = Number(localStorage.getItem('doctorId'));

  allAppointments: any[] = [];
  doctorAppointments: any[] = [];

  filterType: string = 'ALL';

  constructor(private appointmentService: Appointment) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAllAppointment().subscribe((data: any[]) => {

      this.allAppointments = data;

      this.doctorAppointments = data.filter(
        a => Number(a.doctorId) === this.doctorId
      );

      console.log("Doctor Appointments:", this.doctorAppointments);
    });
  }

  //FILTER LOGIC
  get filteredAppointments() {

    const today = new Date().toISOString().split('T')[0];

    switch (this.filterType) {

      case 'TODAY':
        return this.doctorAppointments.filter(
          a => a.appointmentDate === today
        );

      case 'UPCOMING':
        return this.doctorAppointments.filter(
          a => a.appointmentDate > today
        );

      case 'COMPLETED':
        return this.doctorAppointments.filter(
          a => a.appointmentStatus === 'Completed'
        );

      default:
        return this.doctorAppointments;
    }
  }

  //UPDATE STATUS
  markCompleted(appt: any) {

    const updatedData = {
      appointmentStatus: 'Completed'
    };

    this.appointmentService.updateAppointmentStatus(appt.id, updatedData)
      .subscribe(() => {
        appt.appointmentStatus = 'Completed'; // instant UI update
      });
  }
}