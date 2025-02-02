import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public greeting: string = '';
  public username: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.setGreeting();
    this.loadUserData();
  }
  /* Memuat data pengguna dari sessionStorage */
  loadUserData() {
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.username = user.username;
    } else {
      this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
    }
  }
  /* Mengatur tampilan greeting berdasarjan waktu */
  setGreeting() {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      this.greeting = 'Selamat pagi';
    } else if (hour >= 12 && hour < 16) {
      this.greeting = 'Selamat siang';
    } else if (hour >= 16 && hour < 18) {
      this.greeting = 'Selamat sore';
    } else {
      this.greeting = 'Selamat malam';
    }
  }
  /* Menangani proses logout */
  async logout() {
    sessionStorage.clear();
    localStorage.clear();
    await this.router.navigate(['/halamanutama'], { replaceUrl: true });
  }
  /* Load data */
  ionViewWillEnter() {
    this.loadUserData();
  }
}