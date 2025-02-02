import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { PostProvider } from '../../provider/post-provider';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  userData: any = null;
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    const userDataStr = sessionStorage.getItem('currentUser');
    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
      console.log('Loaded user data:', this.userData); 
    } else {
      this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.loadUserData();
      event.target.complete();
    }, 500);
  }
  /* Method konfirmasi menghapus data */
  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Yakin ingin menghapus akun?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel'
        },
        {
          text: 'Ya',
          handler: () => {
            this.deleteData();
          }
        }
      ]
    });

    await alert.present();
  }
  /* Method menghapus data */
  async deleteData() {
    if (!this.userData) {
      const toast = await this.toastController.create({
        message: 'Tidak ada akun untuk dihapus',
        duration: 2000
      });
      toast.present();
      return;
    }

    const body = {
      id: this.userData.id,
      aksi: 'deleteData'
    };
    /* Request ke server */
    this.postPvdr.postData(body, 'action.php').subscribe({
      next: async (data: any) => {
        const toast = await this.toastController.create({
          message: data.success ? 'Akun berhasil dihapus' : 'Gagal menghapus akun',
          duration: 2000
        });
        toast.present();

        if (data.success) {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigateByUrl('/halamanutama');
        }
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: 'Kesalahan jaringan',
          duration: 2000
        });
        toast.present();
      }
    });
  }
}