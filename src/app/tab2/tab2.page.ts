import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public data = [];
  public results = [...this.data];

  constructor(private router: Router) {}

  async logout() {
    try {
      // Clear any stored authentication tokens/data
      localStorage.removeItem('auth_token');
      sessionStorage.clear();
      
      // Navigate to login page and clear navigation history
      const navigationExtras: NavigationExtras = {
        replaceUrl: true
      };
      
      await this.router.navigate(['/halamanutama'], navigationExtras);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}