import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
  
})
export class Appointment {
  
  constructor(private http: HttpClient) {}
  
  private formUrl = "http://localhost:3000/appointment";

  addAppointment(data: any) {
    return this.http.post(`${this.formUrl}/addAppointment`, data);
  }

  getAllAppointment() {
    return this.http.get<any[]>(this.formUrl);
  }

  updateAppointmentStatus(id:any, data:any) {
    return this.http.put(`${this.formUrl}/${id}`, data);
  }

  getAppointmentById(id: any) {
    return this.http.get<any>(`${this.formUrl}/${id}`)
  }

  updateAppointmentById(appointment: any) {
    return this.http.put(`${this.formUrl}/${appointment.id}`, appointment);
  }
}

