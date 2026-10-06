import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../services/appointment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-appointment-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.css',
})
export class AppointmentDetails implements OnInit{

  appointment: any;

  constructor(
    private appointmentService: Appointment,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.route.paramMap.subscribe( params => {
        const id = params.get('id');
        console.log(id);

        if(id) {
          this.appointmentService.getAppointmentById(id).subscribe({
            next: (data) => {
              console.log(data);
              this.appointment = data;
              this.cd.detectChanges();
            },
            error: (err) => console.error(err)
          })
        }
      })
  }

  update() {
    this.appointmentService.updateAppointmentById(this.appointment).subscribe({
        next: () => {
          alert('Updated successfully');
        },
        error: (err) => console.error(err)
    })
  }

}
