import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard';
import { CommonModule } from '@angular/common';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../services/patients.service';
import { Doctor } from '../services/doctor';
import { Staff } from '../services/staff';
import { Appointment } from '../services/appointment';
import { catchError, forkJoin, of } from 'rxjs';

type DashboardMetric = {
  key: string;
  label: string;
  value: number;
  color: string;
};

type SearchResult = {
  id: number | string;
  name: string;
  label: 'Patient' | 'Doctor' | 'Staff';
  extra: string;
  route: any[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  totalPatients = 0;
  totalDoctors = 0;
  totalStaff = 0;
  totalAppointments = 0;
  totalDepartments = 0;
  chartMetrics: DashboardMetric[] = [];
  searchQuery = '';
  isSearchLoading = false;
  isSearchDropdownOpen = false;
  searchInitialized = false;
  patientResults: SearchResult[] = [];
  doctorResults: SearchResult[] = [];
  staffResults: SearchResult[] = [];
  recentPatients: any[] = [];
  recentAppointments: any[] = [];

  private searchDebounce?: ReturnType<typeof setTimeout>;
  private allPatients: any[] = [];
  private allDoctors: any[] = [];
  private allStaff: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private patientsService: PatientsService,
    private doctorService: Doctor,
    private staffService: Staff,
    private appointmentService: Appointment,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardCounts();
    this.loadDashboardData();
  }

  ngOnDestroy() {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
  }

  private loadDashboardCounts() {
    this.dashboardService.getDashboardTotalCounts().subscribe(data => {
      this.totalPatients = data.totalPatients;
      this.totalDoctors = data.totalDoctors;
      this.totalStaff = data.totalStaff;
      this.totalAppointments = data.totalAppointments;
      this.totalDepartments = data.totalDepartments;
      this.chartMetrics = this.buildChartMetrics();
      this.cd.detectChanges();
    });
  }

  private loadDashboardData() {
    forkJoin({
      patients: this.patientsService.getAllPatients().pipe(catchError(() => of([]))),
      appointments: this.appointmentService.getAllAppointment().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ patients, appointments }) => {
        this.allPatients = patients ?? [];
        this.recentPatients = [...this.allPatients]
          .sort((a, b) => this.getSortValue(b?.id) - this.getSortValue(a?.id))
          .slice(0, 3);
        this.recentAppointments = [...(appointments ?? [])]
          .sort((a, b) => this.getAppointmentTimestamp(b) - this.getAppointmentTimestamp(a))
          .slice(0, 3);
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  private buildChartMetrics(): DashboardMetric[] {
    return [
      { key: 'patients', label: 'Patients', value: this.totalPatients, color: '#2563eb' },
      { key: 'doctors', label: 'Doctors', value: this.totalDoctors, color: '#0ea5e9' },
      { key: 'staff', label: 'Staff', value: this.totalStaff, color: '#14b8a6' },
      { key: 'appointments', label: 'Appointments', value: this.totalAppointments, color: '#f97316' },
      { key: 'departments', label: 'Departments', value: this.totalDepartments, color: '#8b5cf6' },
    ];
  }

  get chartMaxValue(): number {
    return Math.max(...this.chartMetrics.map(metric => metric.value), 1);
  }

  get totalEntities(): number {
    return this.chartMetrics.reduce((sum, metric) => sum + metric.value, 0);
  }

  get hasSearchResults(): boolean {
    return this.patientResults.length + this.doctorResults.length + this.staffResults.length > 0;
  }

  getBarHeight(value: number): number {
    return Math.max((value / this.chartMaxValue) * 180, value > 0 ? 24 : 12);
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
      this.cd.detectChanges();
    }, 180);
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
      .slice(0, 5)
      .map(patient => ({
        id: patient.id,
        name: patient.fullName,
        label: 'Patient',
        extra: `ID ${patient.id} | ${patient.mobileNumber ?? 'No phone'}`,
        route: ['/patientsDetails', patient.id],
      }));

    this.doctorResults = this.allDoctors
      .filter(doctor =>
        doctor.fullName?.toLowerCase().includes(normalizedQuery) ||
        doctor.specialization?.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 5)
      .map(doctor => ({
        id: doctor.id,
        name: doctor.fullName,
        label: 'Doctor',
        extra: `${doctor.specialization ?? 'General'} | ${doctor.mobileNumber ?? 'No phone'}`,
        route: ['/doctorDetails', doctor.id],
      }));

    this.staffResults = this.allStaff
      .filter(staff =>
        staff.fullName?.toLowerCase().includes(normalizedQuery) ||
        staff.role?.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 5)
      .map(staff => ({
        id: staff.id,
        name: staff.fullName,
        label: 'Staff',
        extra: `${staff.role ?? 'Team'} | ${staff.mobileNumber ?? 'No phone'}`,
        route: ['/staffDetails', staff.id],
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

  viewAllPatients() {
    this.router.navigate(['/showallpatients']);
  }

  getPatientAvatar(patient: any): string {
    return this.getInitials(patient?.fullName);
  }

  getStatusClass(status: string): string {
    return (status || '').toLowerCase();
  }

  formatPatientAddedDate(patient: any): string {
    if (patient?.createdAt) {
      return this.formatDate(patient.createdAt);
    }

    return 'Existing record';
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'Date unavailable';
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private getInitials(name: string): string {
    return (name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('') || 'PT';
  }

  private getSortValue(id: string | number): number {
    return Number(id) || 0;
  }

  private getAppointmentTimestamp(appointment: any): number {
    const dateTimeValue = `${appointment?.appointmentDate ?? ''}T${appointment?.appointmentTime ?? '00:00'}`;
    const timestamp = new Date(dateTimeValue).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-shell')) {
      this.isSearchDropdownOpen = false;
    }
  }
}
