import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-halamanutama',
  templateUrl: './halamanutama.page.html',
  styleUrls: ['./halamanutama.page.scss'],
})
export class HalamanutamaPage implements OnInit {
  private lastTimeBackPress = 0;
  private timePeriodToExit = 2000;
  private backButtonSubscription: any;

  constructor(
    private router: Router,
    private location: Location,
    private platform: Platform,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.setupBackButtonHandler();
  }

  ionViewWillEnter() {
    this.setupBackButtonHandler();
  }

  ionViewWillLeave() {
    this.unsubscribeBackButton();
  }

  ngOnDestroy() {
    this.unsubscribeBackButton();
  }

  private setupBackButtonHandler() {
    this.unsubscribeBackButton();
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, async () => {
      if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
        App.exitApp();
      } else {
        const toast = await this.toastController.create({
          message: 'Tekan kembali sekali lagi untuk keluar',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
        this.lastTimeBackPress = new Date().getTime();
      }
    });
  }

  private unsubscribeBackButton() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  async navigateToDaftar() {
    await this.router.navigateByUrl('/daftar');
  }
}