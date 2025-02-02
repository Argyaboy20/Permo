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
    this.loadUserDataFromServer();
  }

  ionViewWillEnter() {
    this.loadUserDataFromServer();
  }

  // Method baru untuk mengambil data user dari server
  async loadUserDataFromServer() {
    const userDataStr = sessionStorage.getItem('currentUser');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      
      // Membuat body request untuk mengambil data terbaru
      const body = {
        id: userData.id,
        aksi: 'getLatestUserData'
      };

      try {
        // Request ke server untuk mendapatkan data terbaru
        this.postPvdr.postData(body, 'action.php').subscribe({
          next: (response: any) => {
            if (response.success) {
              // Update data di sessionStorage dengan data terbaru
              const updatedUserData = response.result[0]; // Sesuaikan dengan struktur response dari server
              sessionStorage.setItem('currentUser', JSON.stringify(updatedUserData));
              this.userData = updatedUserData;
            } else {
              this.showToast('Gagal memperbarui data');
            }
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
            this.showToast('Terjadi kesalahan saat mengambil data');
          }
        });
      } catch (error) {
        console.error('Error in loadUserDataFromServer:', error);
        this.showToast('Terjadi kesalahan sistem');
      }
    } else {
      this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
    }
  }

  // Method untuk menampilkan toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  doRefresh(event: any) {
    this.loadUserDataFromServer().then(() => {
      event.target.complete();
    });
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