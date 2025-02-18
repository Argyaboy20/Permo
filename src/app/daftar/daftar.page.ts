import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostProvider } from '../../provider/post-provider';
import { RegisterPageForm } from './form/register.page.form';
import { FormBuilder } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-daftar',
  templateUrl: './daftar.page.html',
  styleUrls: ['./daftar.page.scss'],
})

export class DaftarPage implements OnInit {
  username: string = '';
  email: string = '';
  pss: string = '';
  konfirmasi: string = '';
  registerForm!: RegisterPageForm;
  private backButtonSubscription: any;

  constructor(
    private router: Router,
    public toastController: ToastController,
    private postPvdr: PostProvider,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private location: Location
  ) {
    // Prevent default browser refresh behavior
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      window.addEventListener('beforeunload', (e) => {
        // Store current route
        localStorage.setItem('lastRoute', '/daftar');
      });
    }
  }

  /* Inisialisasi Form */
  ngOnInit() {
    this.createForm();
    this.maintainRoute();
  }

  ionViewWillEnter() {
    // Ensure URL is correct when entering the page
    this.location.replaceState('/daftar');

    // Subscribe to the back button event
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/halamanutama']);
    });
  }
  
  ionViewWillLeave() {
    // Unsubscribe from the back button event when leaving the page
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  private maintainRoute() {
    // Check if we're coming from a refresh
    const lastRoute = localStorage.getItem('lastRoute');
    if (lastRoute === '/daftar') {
      // Force URL to stay as /daftar
      this.location.replaceState('/daftar');
    }

    // Set up refresh handling
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      window.addEventListener('load', () => {
        if (lastRoute === '/daftar') {
          this.location.replaceState('/daftar');
        }
      });
    }
  }

  private createForm() {
    this.registerForm = new RegisterPageForm(this.formBuilder);
  }

  async addRegister() {
    /*validasi keseluruhan data*/
    if (this.username == '' && this.email == '' && this.pss == '' && this.konfirmasi == '') {
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
    else if (this.pss == '') {
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
        pss: this.pss,
        konfirmasi: this.konfirmasi,
        aksi: 'add_register'
      };

      try {
        const data = await this.postPvdr.postData(body, 'action.php').toPromise();

        if (data.success) {
          // Set necessary localStorage items
          localStorage.setItem('isRegistered', 'true');
          localStorage.setItem('userId', data.userId); // Assuming your API returns userId
          localStorage.setItem('userUsername', this.username);
          localStorage.setItem('userKonfirmasi', this.konfirmasi);

          const toast = await this.toastController.create({
            message: 'Pendaftaran berhasil!',
            duration: 2000,
            position: 'bottom'
          });
          await toast.present();

          // Wait for toast to be presented before navigation
          await new Promise(resolve => setTimeout(resolve, 500));

          // Use NavigationExtras to force route reload
          await this.router.navigate(['/tabs/tab2'], {
            replaceUrl: true,
            state: { reload: true }
          });

        } else {
          const toast = await this.toastController.create({
            message: 'Pendaftaran gagal, silakan coba lagi',
            duration: 2000,
            position: 'bottom'
          });
          await toast.present();
        }
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Terjadi kesalahan, silakan coba lagi',
          duration: 2000,
          position: 'bottom'
        });
        await toast.present();
      }
    }
  }
}