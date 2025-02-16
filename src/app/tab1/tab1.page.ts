import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../provider/post-provider';
import { Router } from '@angular/router';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  username: string = '';
  konfirmasi: string = '';
  private backButtonSubscription: any;

  constructor(
    private postPvdr: PostProvider,
    private router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private platform: Platform
  ) { }

  ngOnInit() {
    /* Membersihkan storage */
    localStorage.clear();
    sessionStorage.clear();

    /* Mengatur tombol ack */
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      if (sessionStorage.getItem('currentUser')) {
        return;
      } else {
        App.exitApp();
      }
    });
  }

  /* Membersihkan subscription */
  ngOnDestroy() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  /* Validasi input */
  async login() {
    if (!this.username?.trim() || !this.konfirmasi?.trim()) {
      this.presentToast('Mohon isi username dan password');
      return;
    }
    /* Menampilkan loading */
    const loading = await this.loadingController.create({
      message: 'Mohon tunggu...',
      spinner: 'circles'
    });
    await loading.present();
    /* Proses login */
    const body = {
      username: this.username,
      konfirmasi: this.konfirmasi,
      aksi: 'login'
    };
    /* Request ke server */
    this.postPvdr.postData(body, 'action.php').subscribe({
      next: async (data: any) => {
        await loading.dismiss();

        if (data.success) {
          // Store complete user data in sessionStorage
          const userData = {
            id: data.id,
            username: data.username,
            email: data.email,
            konfirmasi: data.konfirmasi
          };
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
          
          this.presentToast('Login berhasil');
          this.router.navigate(['/tabs/tab2'], { replaceUrl: true });
        } else {
          this.presentToast('Username atau password salah');
        }
      },
      error: async (error) => {
        console.error('Login error:', error);
        await loading.dismiss();
        this.presentToast('Gagal login! Periksa koneksi anda');
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}