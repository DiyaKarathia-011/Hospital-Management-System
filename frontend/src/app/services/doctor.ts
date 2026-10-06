import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Doctor {

private formUrl = "http://localhost:3000/doctors";

constructor(private http: HttpClient) {

}

//getFormData
getDoctorFormData(doctor: any) {
  return this.http.post(`${this.formUrl}/addDoctorDetails`, doctor);
}

//getDoctorList
getDoctorList() {
  return this.http.get<any[]>(this.formUrl);
}

//specific doctor details
getDoctorById(id: any) {
  return this.http.get<any>(`${this.formUrl}/${id}`);
}

//update doctor details 
updateDoctorById(doctor: any) {
  return this.http.put(`${this.formUrl}/${doctor.id}`, doctor);
}

//delete doctor
deleteDoctor(id: any) {
  return this.http.delete(`${this.formUrl}/${id}`);
}

}
