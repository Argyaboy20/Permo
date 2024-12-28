import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../provider/post-provider';

@Component({
  selector: 'app-daftar',
  templateUrl: './daftar.page.html',
  styleUrls: ['./daftar.page.scss'],
})
export class DaftarPage implements OnInit {

  username: string = '';
  email: string = '';
  password: string = '';
  konfirmasi: string = '';


  alertButtons = ["OK"]; //constructor fitur alert
  constructor(
    private router: Router,
    public toastController: ToastController,
    private postPvdr: PostProvider,

  ) {

  }

  ngOnInit() {
  }

  async addRegister() {
    if (this.username == '') {
      const toast = await this.toastController.create({
        message: 'Username harus diisi',
        duration: 2000,
      });
      toast.present();
    } else if (this.email == '') {
      const toast = await this.toastController.create({
        message: 'Email harus diisi',
        duration: 2000,
      });
      toast.present();
    } else if (this.password == '') {
      const toast = await this.toastController.create({
        message: 'Password harus diisi',
        duration: 2000,
      });
      toast.present();
    } else if (this.konfirmasi == '') {
      const toast = await this.toastController.create({
        message: 'Konfirmasi Password harus diisi',
        duration: 2000,
      });
      toast.present();
    } else {
      let body = {
        username: this.username,
        email: this.email,
        password: this.password,
        konfirmasi: this.konfirmasi,
        aksi: 'add_register',
      };
      this.postPvdr.postData(body, 'action.php').subscribe(async (data) => {
        var alertpesan = data.msg;
        if (data.success) {
          this.router.navigate(['href="/tabs/tab2"']);
          const toast = await this.toastController.create({
            message: 'Pendaftaran Sukses',
            duration: 1500,
          });
          toast.present();
        } else {
          const toast = await this.toastController.create({
            message: alertpesan,
            duration: 2000,
          });
          toast.present(); // Added missing toast.present()
        }
      });
    }
  }
}
