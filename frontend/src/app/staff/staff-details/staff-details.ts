import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Staff } from '../../services/staff';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-details.html',
  styleUrl: './staff-details.css',
})
export class StaffDetails implements OnInit{

  constructor(
    private staffService: Staff,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  staff: any;

  ngOnInit(): void {
      
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if(id) {
        this.staffService.getStaffDetails(id).subscribe({
          next: (data) => {
            this.staff = data;
            this.cd.detectChanges();
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  update() {
      this.staffService.updateStaff(this.staff).subscribe({
        next: () => {
          alert("Updated successfully");
        },
        error: err => console.error(err)
      })
  }

  delete() {
    if(!confirm("Delete this staff?")) return;

    this.staffService.deleteStaff(this.staff.id).subscribe({
      next: () => {
        alert("Deleted Successfully");
        this.router.navigate(['/staffList']);
      },
      error: err => console.error(err)
    })
  }
  
}
