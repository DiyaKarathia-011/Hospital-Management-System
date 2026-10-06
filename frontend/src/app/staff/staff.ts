import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Staff } from '../services/staff';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from "@angular/router";


@Component({
  selector: 'app-staff',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './staff.html',
  styleUrl: './staff.css',
})
export class StaffComponent implements OnInit{

  constructor(
    private staffService: Staff,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  staffCount: any;
  role! : string;

  ngOnInit() {

    this.role = this.route.snapshot.paramMap.get('role')!;

    this.staffService.getStaffCounts().subscribe( data => {
      this.staffCount = data;

      this.cd.detectChanges();
    })
  }
}
