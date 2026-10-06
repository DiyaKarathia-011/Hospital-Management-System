import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Department {
  
  constructor(private http: HttpClient) {}

  private formUrl = "http://localhost:3000/department";

  addDepartment(data: any) {
    return this.http.post(`${this.formUrl}/addDepartment`, data)
  }

  getAllDepartment() {
    return this.http.get<any[]>(this.formUrl);
  }
}
