import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Staff } from '../../services/staff';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-list',
  imports: [CommonModule],
  templateUrl: './staff-list.html',
  styleUrl: './staff-list.css',
})
export class StaffList implements OnInit{
  staffList: any[]=[];
  role!: string;
  currentPage = 1;
  pageSize = 5;

  constructor(
    private staffService: Staff,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      
    this.role = this.route.snapshot.paramMap.get('role')!;

    this.staffService.getStaffByRole(this.role).subscribe(data => {
      console.log("DATA:", data);
      this.staffList = data;
      this.currentPage = 1;

    this.cd.detectChanges();  
    })
  }

  editStaff(id: any) {
    this.router.navigate(['/staffDetails', id]);
  }

  addStaff() {
    this.router.navigate(['/addStaff/:role', { role: this.role }]);
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.staffList.length / this.pageSize));
  }

  get paginatedStaff(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.staffList.slice(startIndex, startIndex + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get startItem(): number {
    return this.staffList.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.staffList.length);
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
