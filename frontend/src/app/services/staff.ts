import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Staff {

  constructor(private http: HttpClient){}

  private formUrl = "http://localhost:3000/staff";

  //getFormData
  getStaffFormData(staff: any) {
    return this.http.post(`${this.formUrl}/addStaffDetails`, staff);
  }

  //get Counts
  getStaffCounts() {
    return this.http.get<any[]>(`${this.formUrl}/list/all`);
  }

  //get all staff
  getAllStaff() {
    return this.http.get<any[]>(this.formUrl);
  }

  //get staffList
  getStaffByRole(role: string) {
    return this.http.get<any[]>(`${this.formUrl}/role/${role}`);
  }

  //get specific Staff details
  getStaffDetails(id: any) {
    return this.http.get<any>(`${this.formUrl}/${id}`);
  }

  //update staffDetails
  updateStaff(staff: any) {
    return this.http.put(`${this.formUrl}/${staff.id}`, staff);
  }

  //delete staff
  deleteStaff(id: any) {
    return this.http.delete(`${this.formUrl}/${id}`)
  }
}
