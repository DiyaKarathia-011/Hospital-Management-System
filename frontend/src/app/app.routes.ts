import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Doctors } from './doctors/doctors';
import { StaffComponent } from './staff/staff';
import { DepartmentComponent } from './department/department';
import { AppointmentComponent } from './appointment/appointment';
import { Patient } from './patient/patient';
import { Layout } from './layout/layout';
import { DoctorAppointmentsComponent } from './doctor/appointments/appointments';
import { DoctorDashboardComponent } from './doctor/dashboard/dashboard';
import { DoctorPatientsComponent } from './doctor/patients/patients';
import { AuthGuard } from './services/auth-guard';
import { RoleGuard } from './services/role-guard';

export const routes: Routes = [

  //  LOGIN (outside layout)

  {
    path: 'login',
    component: Login
  },

  // ================= ADMIN =================
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      //patient 
      {
        path: 'patient',
        component: Patient
      },
      {
        path: 'showallpatients',
        loadComponent: () =>
          import('./patient/show-all-patients/show-all-patients')
            .then(m => m.ShowAllPatientsComponent)
      },
      {
        path: 'patientsDetails/:id',
        loadComponent: () =>
          import('./patient/patients-details/patients-details')
            .then(m => m.PatientsDetailsComponent)
      },
      {
        path: 'patients/add',
        loadComponent: () =>
          import('./patient/add-patient/add-patient')
            .then(m => m.AddPatientComponent)
      },

      //doctor
      {
        path: 'doctors',
        component: Doctors
      },
      {
        path: 'addDoctor',
        loadComponent: () =>
          import('./doctors/add-doctor/add-doctor')
            .then(m => m.AddDoctorComponent)
      },
      {
        path: 'doctorDetails/:id',
        loadComponent: () =>
          import('./doctors/doctor-details/doctor-details')
            .then(m => m.DoctorDetails)
      },

      //staff
      {
        path: 'staff',
        component: StaffComponent
      },
      {
        path: 'addStaff/:role',
        loadComponent: () =>
          import('./staff/add-staff/add-staff')
            .then(m => m.AddStaffComponent)
      },
      {
        path: 'staffList/:role',
        loadComponent: () =>
          import('./staff/staff-list/staff-list')
            .then(m => m.StaffList)
      },
      {
        path: 'staffDetails/:id',
        loadComponent: () =>
          import('./staff/staff-details/staff-details')
            .then(m => m.StaffDetails)
      },

      //department
      {
        path: 'departments',
        component: DepartmentComponent
      },
      { path: 'departments', component: DepartmentComponent },
      {
        path: 'addDepartment',
        loadComponent: () =>
          import('./department/add-department/add-department')
            .then(m => m.AddDepartment)
      },

      //appointment
      {
        path: 'appointments',
        component: AppointmentComponent
      },
      {
        path: 'createAppointment',
        loadComponent: () =>
          import('./appointment/add-appoitment/add-appoitment')
            .then(m => m.AddAppoitment)
      },
      {
        path: 'updateAppointment/:id',
        loadComponent: () =>
          import('./appointment/appointment-details/appointment-details')
            .then(m => m.AppointmentDetails)
      }


    ]
  },

  // ================= DOCTOR =================
  {
    path: 'doctor',
    component: Layout,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'DOCTOR' },
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'appointments', component: DoctorAppointmentsComponent },
      { path: 'patients', component: DoctorPatientsComponent }
    ]
  },

  // DEFAULT
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // default
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];