import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../services/appointment';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DoctorDashboardComponent {

  doctorId = Number(localStorage.getItem('doctorId'));

  allAppointments: any[] = [];
  doctorAppointments: any[] = [];
  todayAppointments: any[] = [];

  totalAppointments = 0;
  completedCount = 0;
  pendingCount = 0;

  constructor(
    private appointmentService: Appointment,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadData();
  }

  // LOAD DATA FROM API
  loadData() {
    this.appointmentService.getAllAppointment().subscribe((data: any[]) => {

      console.log("Doctor ID:", this.doctorId);
      console.log("All Data:", data);

      //FILTER BY doctorId
      this.doctorAppointments = data.filter(
        a => Number(a.doctorId) === this.doctorId
      );

      console.log("Filtered Data:", this.doctorAppointments);

      //TOTAL
      this.totalAppointments = this.doctorAppointments.length;
      console.log("Total:", this.totalAppointments);
      //TODAY FILTER
      const today = new Date().toISOString().split('T')[0];

      this.todayAppointments = this.doctorAppointments.filter(
        a => a.appointmentDate === today
      );

      //STATUS COUNT
      this.completedCount = this.doctorAppointments.filter(
        a => a.appointmentStatus === 'Completed'
      ).length;

      this.pendingCount = this.doctorAppointments.filter(
        a => a.appointmentStatus === 'Scheduled'
      ).length;

      this.cd.detectChanges();

    });
  }

  //UPDATE STATUS (API CALL)
  markCompleted(appt: any) {

    const updatedData = {
      status: 'Completed'
    };

    this.appointmentService.updateAppointmentStatus(appt.id, updatedData)
      .subscribe({
        next: () => {

          // Update UI instantly
          appt.status = 'Completed';

          // Refresh dashboard counts
          this.loadData();

        },
        error: (err) => {
          console.error("Error updating status", err);
        }
      });
  }
}