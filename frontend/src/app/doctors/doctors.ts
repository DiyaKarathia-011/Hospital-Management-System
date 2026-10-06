import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Doctor } from '../services/doctor';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors implements OnInit {
  doctorList: any[] = [];
  currentPage = 1;
  pageSize = 5;

  constructor(
    private doctorService: Doctor,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctorList().subscribe({
      next: (data) => {
        console.log("DATA:", data);
        this.doctorList = data;
        this.currentPage = 1;

        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    })
  }

  editDoctor(id: any) {
    this.router.navigate(['/doctorDetails', id]);
  }

  addDoctor() {
    this.router.navigate(['/addDoctor']);
  }
  trackById(index: number, item: any) {
    return item.id;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.doctorList.length / this.pageSize));
  }

  get paginatedDoctors(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.doctorList.slice(startIndex, startIndex + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get startItem(): number {
    return this.doctorList.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.doctorList.length);
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
