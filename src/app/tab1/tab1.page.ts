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
    // Clear any existing session data
    if (!localStorage.getItem('userId')) {
      localStorage.clear();
    }

    // Handle back button
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      if (localStorage.getItem('userId')) {
        // If logged in, prevent going back
        return;
      } else {
        // If not logged in, exit app
        App.exitApp();
      }
    });
  }

  ngOnDestroy() {
    // Clean up the subscription
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  async login() {
    console.log('Starting login process...', {
      username: this.username,
      konfirmasi: this.konfirmasi
    });

    // Validasi input
    if (!this.username?.trim() || !this.konfirmasi?.trim()) {
      this.presentToast('Mohon isi username dan password');
      return;
    }

    // Tampilkan loading
    const loading = await this.loadingController.create({
      message: 'Mohon tunggu...',
      spinner: 'circles'
    });
    await loading.present();

    // Siapkan data untuk dikirim ke server
    const body = {
      username: this.username,
      konfirmasi: this.konfirmasi,
      aksi: 'login'
    };

    // Kirim request ke server
    this.postPvdr.postData(body, 'action.php').subscribe({
      next: async (data: any) => {
        console.log('Received response:', data);
        await loading.dismiss();

        if (data.success) {
          // Simpan data user ke localStorage
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userUsername', data.username);
          localStorage.setItem('userKonfirmasi', data.konfirmasi);

          // Tampilkan pesan sukses
          this.presentToast('Login berhasil');

          // Pindah ke halaman dashboard
          this.router.navigate(['/tabs/tab2'], { replaceUrl: true });
        } else {
          console.log('Login failed:', data.message);
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