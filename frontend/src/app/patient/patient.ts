import { Component } from '@angular/core';
import { PatientsService } from '../services/patients.service';

@Component({
  selector: 'app-patient',
  imports: [],
  templateUrl: './patient.html',
  styleUrl: './patient.css',
})
export class Patient {
  constructor(
    private patientsService: PatientsService
  ) {}
}
