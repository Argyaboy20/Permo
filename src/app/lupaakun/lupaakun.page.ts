import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../provider/post-provider';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-lupaakun',
  templateUrl: './lupaakun.page.html',
  styleUrls: ['./lupaakun.page.scss'],
})
export class LupaakunPage implements OnInit {
  email: string = '';

  constructor(
    private postPvdr: PostProvider,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}
   /* Validasi Email */
  async kirimInformasi() {
    if (!this.email) {
      this.presentToast('Harap isi email');
      return;
    }
     /* Menampilkan loading spinner */
    const loading = await this.loadingController.create({
      message: 'Mengirim informasi...',
      spinner: 'circles'
    });
    await loading.present();
     /* Menyiapkan data untuk API */
    const body = {
      email: this.email,
      aksi: 'lupa_akun'
    };
     /* Mengirim request ke server */
    this.postPvdr.postData(body, 'action.php').subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        if (response.success) {
          this.presentToast('Informasi akun telah dikirim ke email');
        } else {
          this.presentToast(response.message || 'Gagal mengirim informasi');
        }
      },
      error: async () => {
        await loading.dismiss();
        this.presentToast('Kesalahan jaringan');
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