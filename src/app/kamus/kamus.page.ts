import { Component, OnInit, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-kamus',
  templateUrl: './kamus.page.html',
  styleUrls: ['./kamus.page.scss'],
})
export class KamusPage implements OnInit {
  searchText!: string;
  private backButtonSubscription: any;
  
  tumbuhan: any = [
    { id: 1, title: 'ALPUKAT', description: 'Nama latin: Persea Americana'},
    { id: 2, title: 'BAWANG MERAH', description: 'Nama latin:  Allium Ascalonicum'},
    { id: 3, title: 'BAWANG PUTIH', description: 'Nama latin: Allium Sativum'},
    { id: 4, title: 'CABAI', description: 'Nama latin: Capsicum Annuum'},
    { id: 5, title: 'DURIAN', description: 'Nama latin: Durio Zibethinus'},
    { id: 6, title: 'GANDUM', description: 'Nama latin: Triticum Aestivum'},
    { id: 7, title: 'JAGUNG', description: 'Nama latin: Zea Mays'},
    { id: 8, title: 'KEDELAI', description: 'Nama latin: Glycine Max'},
    { id: 9, title: 'KENTANG', description: 'Nama latin: Solanum Tuberosum '},
    { id: 10, title: 'LADA', description: 'Nama latin: Piper Nigrum'},
    { id: 11, title: 'MELINJO', description: 'Nama latin: Gnetum Gnemon'},
    { id: 12, title: 'NANGKA', description: 'Nama latin: Artocarpus Heterophyllus'},
    { id: 13, title: 'PADI', description: 'Nama latin: Oryza Sativa'},
    { id: 14, title: 'RAMBUTAN', description: 'Nama latin: Nephelium Lappaceum'},
    { id: 15, title: 'SALAK', description: 'Nama latin: Salacca Zalacca'},
    { id: 16, title: 'TERONG', description: 'Nama latin: Solanum Melongena'},
    { id: 17, title: 'UBI JALAR', description: 'Nama latin: Ipomoea Batatas'},
    { id: 18, title: 'WORTEL', description: 'Nama latin: Daucus Carota'},
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
        localStorage.setItem('lastRoute', '/kamus');
      });
    }
  }

  ngOnInit() {
    this.maintainRoute();
  }

  ionViewWillEnter() {
    // Ensure URL is correct when entering the page
    this.location.replaceState('/kamus');

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
    if (lastRoute === '/kamus') {
      // Force URL to stay as /kamus
      this.location.replaceState('/kamus');
    }

    // Set up refresh handling
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      window.addEventListener('load', () => {
        if (lastRoute === '/kamus') {
          this.location.replaceState('/kamus');
        }
      });
    }
  }

   /* Routing Method */ 
  goToDetail(tumbuhan: any){
    this.router.navigate(['/detail', tumbuhan.id]); 
  }

}
