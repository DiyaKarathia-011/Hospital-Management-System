import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../services/doctor';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-doctor-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.css',
})
export class DoctorDetails implements OnInit{

  doctor: any;

  constructor(
    private doctorService: Doctor,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');

        if(id) {
          this.doctorService.getDoctorById(id).subscribe({
            next: (data) => {
              this.doctor = data;
              this.cd.detectChanges();
            },
            error: (err) => console.error(err)
          })
        }
      })
  }

  update() {
    this.doctorService.updateDoctorById(this.doctor).subscribe({
      next: () => {
        alert("Updated successfully");
      },
      error: err => console.error(err)
    })
  }

  delete() {
    if(!confirm("Delete this Doctor?")) return;

    this.doctorService.deleteDoctor(this.doctor.id).subscribe({
      next: () => {
        alert("Deleted Successfully");
        this.router.navigate(['/doctors']);
      },
      error: err => console.error(err)
    })
  }

}
