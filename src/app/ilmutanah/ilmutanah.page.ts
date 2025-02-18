import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ilmutanah',
  templateUrl: './ilmutanah.page.html',
  styleUrls: ['./ilmutanah.page.scss'],
})
export class IlmutanahPage implements OnInit {
  searchIsi!: string;
  private backButtonSubscription: any;
  
  tanah: any = [
    { id: 1, title: 'ALUVIAL', description: 'Nama latin: Alluvial Soil'},
    { id: 2, title: 'ANDOSOL', description: 'Nama latin:  Andosols'},
    { id: 3, title: 'ENTISOL', description: 'Nama latin: Entisols'},
    { id: 4, title: 'GRUMUSOL', description: 'Nama latin: Grumosols'},
    { id: 5, title: 'HUMUS', description: 'Nama latin: Humic Soil'},
    { id: 6, title: 'INCEPTISOL', description: 'Nama latin: Inceptisols'},
    { id: 7, title: 'LATOSOL', description: 'Nama latin: Latosols'},
    { id: 8, title: 'LATERIT', description: 'Nama latin: Laterite Soil'},
    { id: 9, title: 'LITOSOL', description: 'Nama latin: Litosols'},
    { id: 10, title: 'MERGEL', description: 'Nama latin: Mergel Soil'},
    { id: 11, title: 'OXISOL', description: 'Nama latin: Oxisols'},
    { id: 12, title: 'ORGANOSOL', description: 'Nama latin: Organosols'},
    { id: 13, title: 'PODSOL', description: 'Nama latin: Podzols'},
    { id: 14, title: 'REGOSOL', description: 'Nama latin: Regosols'},
    { id: 15, title: 'VULKANIK', description: 'Nama latin: Volcanic Soil'},
  ];

  constructor(
    private router: Router,
    private platform: Platform,
    private location: Location
  ) {
    // Prevent default browser refresh behavior
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      window.addEventListener('beforeunload', (e) => {
        // Store current route
        localStorage.setItem('lastRoute', '/ilmutanah');
      });
    }
  }

  ngOnInit() {
    this.maintainRoute();
  }

  ionViewWillEnter() {
    // Ensure URL is correct when entering the page
    this.location.replaceState('/ilmutanah');

    // Subscribe to the back button event
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/tabs/tab2']);
    });
  }
  
  ionViewWillLeave() {
    // Unsubscribe from the back button event when leaving the page
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  private maintainRoute() {
    // Check if we're coming from a refresh
    const lastRoute = localStorage.getItem('lastRoute');
    if (lastRoute === '/ilmutanah') {
      // Force URL to stay as /ilmutanah
      this.location.replaceState('/ilmutanah');
    }

    // Set up refresh handling
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      window.addEventListener('load', () => {
        if (lastRoute === '/ilmutanah') {
          this.location.replaceState('/ilmutanah');
        }
      });
    }
  }
  
   /* Routing method */
  goToIsi(tanah: any){
  this.router.navigate(['/detailtanah', tanah.id]);
}

}
