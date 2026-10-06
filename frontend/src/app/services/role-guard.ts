import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const role = localStorage.getItem('role');
    const expectedRole = route.data?.['role']; 

    console.log("User Role:", role);
    console.log("Expected Role:", expectedRole);

  
    if (role && expectedRole && role === expectedRole) {
      return true;
    }

    console.log("Role mismatch → redirecting to login");

    this.router.navigate(['/login']);
    return false;
  }
}