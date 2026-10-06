import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Appointment } from '../services/appointment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class AppointmentComponent implements OnInit{
  appointmentList: any[] =[];
  currentPage = 1;
  pageSize = 5;

  constructor(
    private appointmentService: Appointment,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
    
    
  ) {}

  ngOnInit(): void {
      this.loadAppointment();
      
      
  }

  loadAppointment() {
    this.appointmentService.getAllAppointment().subscribe({
      next: (data) => {
        console.log("Type:", Array.isArray(data), data);
        this.appointmentList = [...data];
        this.currentPage = 1;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    })

    
  }
  

  edit(id: any) {
    this.router.navigate(['/updateAppointment', id])
  }

  addAppointment() {
    this.router.navigate(['/createAppointment']);
  }

  onStatusChange(appointment: any) {
    this.appointmentService.updateAppointmentStatus(appointment.id, appointment).subscribe({
      next: () => {
        console.log("Status updated in JSON");
        this.loadAppointment();
      },
      error: (err) => console.error(err)
    }) 

    
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.appointmentList.length / this.pageSize));
  }

  get paginatedAppointments(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.appointmentList.slice(startIndex, startIndex + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get startItem(): number {
    return this.appointmentList.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.appointmentList.length);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
}
