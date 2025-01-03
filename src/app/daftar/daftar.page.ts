import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../provider/post-provider';
import { RegisterPageForm } from './form/register.page.form';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-daftar',
  templateUrl: './daftar.page.html',
  styleUrls: ['./daftar.page.scss'],
})

export class DaftarPage implements OnInit {

  username: string = '';
  email: string = '';
  pass: string = '';
  konfirmasi: string = '';
  registerForm!: RegisterPageForm;

  constructor(
    private router: Router,
    public toastController: ToastController,
    private postPvdr: PostProvider,
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.registerForm = new RegisterPageForm(this.formBuilder);
  }

  async addRegister() {
    /*validasi keseluruhan data*/
    if (this.username == '' && this.email == '' && this.pass == '' && this.konfirmasi == '') {
      const toast = await this.toastController.create({
        message: 'Harap isi data yang dibutuhkan',
        duration: 2000,
      });
      toast.present();
    }
    /*validasi username*/
    else if (this.username == '') {
      const toast = await this.toastController.create({
        message: 'Username harus diisi',
        duration: 2000,
      });
      toast.present();
    }
    /*validasi input email*/
    else if (this.email == '') {
      const toast = await this.toastController.create({
        message: 'Email harus diisi',
        duration: 2000,
      });
      toast.present();
    }
    /*validasi input password*/
    else if (this.pass == '') {
      const toast = await this.toastController.create({
        message: 'Password harus diisi',
        duration: 2000,
      });
      toast.present();
    }
    /*validasi input konfirmasi password*/
    else if (this.konfirmasi == '') {
      const toast = await this.toastController.create({
        message: 'Konfirmasi Password harus diisi',
        duration: 2000,
      });
      toast.present();
    } else {
      let body = {
        username: this.username,
        email: this.email,
        password: this.pass,
        konfirmasi: this.konfirmasi,
        aksi: 'add_register'
      };
      this.postPvdr.postData(body, 'action.php').subscribe(async data => {
        if (data.success) {
          this.router.navigate(['/tab2']);
        }
      })
    }
  }
}