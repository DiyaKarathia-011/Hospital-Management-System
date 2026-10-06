import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class PatientsService {

private formUrl = "http://localhost:3000/patients";

constructor(private http: HttpClient) {

}

//ShowAllPatient
getAllPatients() {
  return this.http.get<any[]>(this.formUrl);
}

//getFormData
getPatientsFormData(patient: any) {
  return this.http.post(`${this.formUrl}/addDetails`, patient);
}

//specific patientDetails
getPatientById(id: any) {
  return this.http.get<any>(`${this.formUrl}/${id}`);
}

//update patientDetails
updatePatient(patient: any) {
  return this.http.put(`${this.formUrl}/${patient.id}`, patient);
}

//delete patient  
deletePatient(id: any) {
  return this.http.delete(`${this.formUrl}/${id}`);
}

}
