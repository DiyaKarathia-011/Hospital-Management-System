import { Component, OnInit } from '@angular/core';
import { PatientsService } from '../../services/patients.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-show-all-patients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-all-patients.html',
  styleUrls: ['./show-all-patients.css'],
})
export class ShowAllPatientsComponent implements OnInit {

  patientsList: any[] = [];
  currentPage = 1;
  pageSize = 5;

  constructor(
    private patientsService: PatientsService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
  console.log("INIT FIRED");  
  this.loadPatients();
}


 loadPatients() {
  this.patientsService.getAllPatients().subscribe({
    next: (data) => {
      console.log("DATA:", data);
      this.patientsList = data;
      this.currentPage = 1;

      this.cd.detectChanges();   
    },
    error: (err) => console.error(err)
  });
}


  editPatient(id: any) {
    this.router.navigate(['/patientsDetails', id]);
  }

  addPatient() {
    this.router.navigate(['/patients/add']);
  }
  
  trackById(index: number, item: any) {
    return item.id;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.patientsList.length / this.pageSize));
  }

  get paginatedPatients(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.patientsList.slice(startIndex, startIndex + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get startItem(): number {
    return this.patientsList.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.patientsList.length);
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

