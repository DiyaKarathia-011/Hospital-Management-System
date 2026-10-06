import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../services/patients.service';
import { Doctor } from '../services/doctor';
import { Staff } from '../services/staff';
import { catchError, forkJoin, of } from 'rxjs';

type SearchResult = {
  id: number | string;
  name: string;
  label: 'Patient' | 'Doctor' | 'Staff';
  extra: string;
  route: any[];
  badgeClass: string;
};

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit, OnDestroy {
  searchQuery = '';
  isSearchLoading = false;
  isSearchDropdownOpen = false;
  searchInitialized = false;
  patientResults: SearchResult[] = [];
  doctorResults: SearchResult[] = [];
  staffResults: SearchResult[] = [];
  private allPatients: any[] = [];
  private allDoctors: any[] = [];
  private allStaff: any[] = [];
  private searchDebounce?: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private patientsService: PatientsService,
    private doctorService: Doctor,
    private staffService: Staff
  ) {}

  role: string | null = '';

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
    console.log("ROLE IN LAYOUT:", this.role);
    this.loadSearchData();
  }

  ngOnDestroy() {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
  }

  private loadSearchData() {
    forkJoin({
      patients: this.patientsService.getAllPatients().pipe(catchError(() => of([]))),
      doctors: this.doctorService.getDoctorList().pipe(catchError(() => of([]))),
      staff: this.staffService.getAllStaff().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ patients, doctors, staff }) => {
        this.allPatients = patients ?? [];
        this.allDoctors = doctors ?? [];
        this.allStaff = staff ?? [];
      },
      error: (err) => console.error(err)
    });
  }

 
  logOut() {
    // you can clear storage if using auth
    localStorage.clear();

    // navigate to login page
    this.router.navigate(['/login']);
  }

  get hasSearchResults(): boolean {
    return this.patientResults.length + this.doctorResults.length + this.staffResults.length > 0;
  }

  onSearchInput() {
    const query = this.searchQuery.trim();
    this.searchInitialized = query.length > 0;
    this.isSearchDropdownOpen = query.length > 0;

    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }

    if (!query) {
      this.clearSearchResults();
      return;
    }

    this.isSearchLoading = true;
    this.searchDebounce = setTimeout(() => {
      this.runSearch(query);
      this.isSearchLoading = false;
    }, 120);
  }

  clearSearchResults() {
    this.isSearchLoading = false;
    this.patientResults = [];
    this.doctorResults = [];
    this.staffResults = [];
  }

  private runSearch(query: string) {
    const normalizedQuery = query.toLowerCase();

    this.patientResults = this.allPatients
      .filter(patient =>
        patient.fullName?.toLowerCase().includes(normalizedQuery) ||
        String(patient.id).toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 4)
      .map(patient => ({
        id: patient.id,
        name: patient.fullName,
        label: 'Patient',
        extra: `ID ${patient.id} | ${patient.mobileNumber ?? 'No phone'}`,
        route: ['/patientsDetails', patient.id],
        badgeClass: 'patient-badge',
      }));

    this.doctorResults = this.allDoctors
      .filter(doctor =>
        doctor.fullName?.toLowerCase().includes(normalizedQuery) ||
        doctor.specialization?.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 4)
      .map(doctor => ({
        id: doctor.id,
        name: doctor.fullName,
        label: 'Doctor',
        extra: `${doctor.specialization ?? 'General'} | ${doctor.mobileNumber ?? 'No phone'}`,
        route: ['/doctorDetails', doctor.id],
        badgeClass: 'doctor-badge',
      }));

    this.staffResults = this.allStaff
      .filter(staff =>
        staff.fullName?.toLowerCase().includes(normalizedQuery) ||
        staff.role?.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 4)
      .map(staff => ({
        id: staff.id,
        name: staff.fullName,
        label: 'Staff',
        extra: `${staff.role ?? 'Team'} | ${staff.mobileNumber ?? 'No phone'}`,
        route: ['/staffDetails', staff.id],
        badgeClass: 'staff-badge',
      }));
  }

  highlightMatch(value: string): string {
    if (!value) {
      return '';
    }

    const query = this.searchQuery.trim();
    if (!query) {
      return value;
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return value.replace(new RegExp(`(${escapedQuery})`, 'gi'), '<mark>$1</mark>');
  }

  navigateFromSearch(result: SearchResult) {
    this.isSearchDropdownOpen = false;
    this.router.navigate(result.route);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-search')) {
      this.isSearchDropdownOpen = false;
    }
  }

}
