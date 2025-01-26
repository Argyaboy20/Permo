import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../provider/post-provider';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  username: string = '';
  konfirmasi: string = '';

  constructor(
    private postPvdr: PostProvider,
    private router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  ngOnInit() { }

  async login() {
    if (!this.username || !this.konfirmasi) {
      this.presentToast('Harap isi username dan password');
      return;
    }

    // Show loading
    const loading = await this.loadingController.create({
      message: 'Mohon tunggu...',
      spinner: 'circles',
      duration: 1500
    });
    await loading.present();

    const body = {
      username: this.username,
      konfirmasi: this.konfirmasi,
      aksi: 'login'
    };

    this.postPvdr.postData(body, 'action.php').subscribe({
      next: async (response: any) => {

        if (response.success) {
          localStorage.setItem('userId', response.id);
          localStorage.setItem('userUsername', response.username);
        }
        await loading.dismiss();
        this.router.navigateByUrl('/tabs/tab2');
      },
      error: async () => {
        await loading.dismiss();
        this.presentToast('Login gagal! Periksa kembali username dan password anda');
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}