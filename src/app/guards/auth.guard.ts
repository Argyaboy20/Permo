import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in by verifying localStorage data
    const isLoggedIn = localStorage.getItem('userId') && 
                       localStorage.getItem('userUsername') && 
                       localStorage.getItem('userKonfirmasi');

    if (isLoggedIn) {
      return true;
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/tabs/tab1']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('userId') && 
                       localStorage.getItem('userUsername') && 
                       localStorage.getItem('userKonfirmasi');

    if (isLoggedIn) {
      // Redirect to dashboard if already logged in
      this.router.navigate(['/tabs/tab2']);
      return false;
    }
    return true;
  }
}