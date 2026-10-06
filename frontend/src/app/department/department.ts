import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Department } from '../services/department';
import { Router } from '@angular/router';

@Component({
  selector: 'app-department',
  imports: [CommonModule],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class DepartmentComponent implements OnInit{

  departmentList: any[] = [];

  constructor(
    private departmentService: Department,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.loadData();
  }

  loadData() {
    this.departmentService.getAllDepartment().subscribe({
      next: (data) => {
        console.log(data);
        this.departmentList = data;

        this.cd.detectChanges();
      },
      error: (err) => console.log(err)
    })
  }

  getIcon(name: string) {
  switch(name.toLowerCase()) {
    case 'cardiology': return '❤️';
    case 'ent': return '👂';
    case 'gynecology': return '👩‍⚕️';
    case 'ophthalmology': return '👁️';
    case 'orthopedics': return '🦴';
    default: return '🏥';
  }
}
  
}
