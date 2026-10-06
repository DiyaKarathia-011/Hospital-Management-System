import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
  private dashUrl = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardTotalCounts() {
    return this.http.get<any>(this.dashUrl);

  }
}
