import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  public greeting: string = '';
  public username: string = '';
  private subscription: Subscription = new Subscription();
  private backButtonSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private alertController: AlertController,
    private platform: Platform
  ) {
    this.preventNavigationAfterLogout();
  }

  ngOnInit() {
    this.setGreeting();
    this.loadUserData();
    this.handleHardwareBackButton();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.backButtonSubscription.unsubscribe();
  }

  private preventNavigationAfterLogout() {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (localStorage.getItem('isLoggedOut') === 'true' && 
            window.location.pathname !== '/halamanutama') {
          window.location.href = '/halamanutama';
        }
      });
  }

  private handleHardwareBackButton() {
    this.backButtonSubscription = this.platform.backButton
      .subscribeWithPriority(9999, () => {
        if (localStorage.getItem('isLoggedOut') === 'true') {
          window.location.href = '/halamanutama';
        }
      });
  }

   /* Menangani proses logout */
  async logout() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel'
        },
        {
          text: 'Ya',
          handler: () => {
            this.performLogout();
          }
        }
      ]
    });
    await alert.present();
  }

  private performLogout() {
    sessionStorage.clear();
    localStorage.clear();
    localStorage.setItem('isLoggedOut', 'true');
    
    window.history.pushState(null, '', '/halamanutama');
    window.onpopstate = function() {
      window.history.pushState(null, '', '/halamanutama');
    };
    
    window.location.href = '/halamanutama';
  }

   /* Memuat data pengguna dari sessionStorage */
  loadUserData() {
    if (localStorage.getItem('isLoggedOut') === 'true') {
      window.location.href = '/halamanutama';
      return;
    }

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

  /* Load data */
  ionViewWillEnter() {
    if (localStorage.getItem('isLoggedOut') === 'true') {
      window.location.href = '/halamanutama';
      return;
    }
    this.loadUserData();
  }
}