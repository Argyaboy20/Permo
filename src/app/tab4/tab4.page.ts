import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../provider/post-provider';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  daftars: any[] = [];
  limit: number = 1;
  start: number = 0;
  id: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private postPvdr: PostProvider,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.loadDaftar();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ionViewWillEnter() {
    this.daftars = [];
    this.start = 0;
    this.loadDaftar();
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500);
  }

  loadData(event: any) {
    this.start += this.limit;
    setTimeout(() => {
      this.loadDaftar().then(() => {
        event.target.complete();
      });
    }, 500);
  }

  loadDaftar() {
    return new Promise(resolve => {
      let body = {
        aksi: 'getdata',
        limit: this.limit,
        start: this.start,
      };

      this.postPvdr.postData(body, 'action.php').subscribe({
        next: (data: any) => {
          if (data.success && data.result) {
            this.daftars = [...this.daftars, ...data.result];
            resolve(true);
          }
        },
        error: (error) => {
          console.error('Error fetching data', error);
          resolve(false);
        }
      });
    });
  }

  async deleteData() {
    if (this.daftars.length === 0) {
      const toast = await this.toastController.create({
        message: 'Tidak ada akun untuk dihapus',
        duration: 2000
      });
      toast.present();
      return;
    }

    const body = {
      id: this.daftars[0].id,
      aksi: 'deleteData'
    };

    this.postPvdr.postData(body, 'action.php').subscribe({
      next: async (data: any) => {
        const toast = await this.toastController.create({
          message: data.success ? 'Akun berhasil dihapus' : 'Gagal menghapus akun',
          duration: 2000
        });
        toast.present();

        if (data.success) {
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
