import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bantuan',
  templateUrl: './bantuan.page.html',
  styleUrls: ['./bantuan.page.scss'],
})
export class BantuanPage implements OnInit {
  bantuanForm: FormGroup;
  apiUrl = 'http://127.0.0.1/api/action.php';
  isSubmitting = false;
  validationErrors: { [key: string]: string } = {};

   /* Inisialisasi Form */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router
  ) {
    this.bantuanForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      kendala: ['', Validators.required]
    });
  }

  ngOnInit() {
     /* Menambahkan listener untuk perubahan nilai username dan email */
    this.bantuanForm.get('username')?.valueChanges.subscribe(() => {
      if (this.validationErrors['username']) {
        this.validateField('username');
      }
    });

    this.bantuanForm.get('email')?.valueChanges.subscribe(() => {
      if (this.validationErrors['email']) {
        this.validateField('email');
      }
    });
  }
   /* Validasi input field dan pengecekan ke server */
  async validateField(fieldName: string) {
    const field = this.bantuanForm.get(fieldName);
    if (!field || !field.value || field.invalid) {
      this.validationErrors[fieldName] = fieldName === 'email' ? 
        'Email tidak valid atau tidak diisi' : 'Username tidak diisi';
      return false;
    }
      /*/ validasi lokal */
    const formData = {
      aksi: 'validate_user',
      [fieldName]: field.value
    };
      /* validasi dengan server */
    try {
      const response: any = await this.http.post(this.apiUrl, formData).toPromise();
      if (!response.success) {
        this.validationErrors[fieldName] = `${fieldName === 'email' ? 'Email' : 'Username'} tidak terdaftar`;
        return false;
      }
      delete this.validationErrors[fieldName];
      return true;
    } catch (error) {
      this.validationErrors[fieldName] = 'Gagal melakukan validasi';
      return false;
    }
  }
   /* Mengecek status validasi field */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bantuanForm.get(fieldName);
    return (field!.invalid && (field!.dirty || field!.touched)) || !!this.validationErrors[fieldName];
  }
   /* Mendapatkan pesan error untuk field */
  getErrorMessage(fieldName: string): string {
    return this.validationErrors[fieldName] || 
           (fieldName === 'email' ? 'Email tidak valid atau tidak diisi' : 'Username tidak diisi');
  }
   /* Validasi form sebelum submit */
  async submitForm() {
    if (this.bantuanForm.invalid || this.isSubmitting) {
      this.showAlert('Error', 'Mohon lengkapi semua data dengan benar');
      return;
    }

     /* Validate both fields before submitting */
    const isUsernameValid = await this.validateField('username');
    const isEmailValid = await this.validateField('email');

    if (!isUsernameValid || !isEmailValid) {
      this.showAlert('Peringatan', 'Harap dicek kembali data yang diperlukan');
      return;
    }

    this.isSubmitting = true;

    /* Proses pengiriman data ke server*/
    const formData = {
      aksi: 'add_bantuan',
      username: this.bantuanForm.get('username')?.value,
      email: this.bantuanForm.get('email')?.value,
      kendala: this.bantuanForm.get('kendala')?.value
    };
      /* proses HTTP request */
    this.http.post(this.apiUrl, formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        
        if (response.success) {
          this.showSuccessAlert('Sukses', 'Kendala berhasil dikirim');
          this.bantuanForm.reset();
        } else {
          this.showAlert('Error', response.message || 'Gagal mengirim kendala');
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.showAlert('Error', 'Gagal mengirim data kendala. Silakan coba lagi.');
      }
    });
  }
    /* Menampilkan alert umum */
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  /* Menampilkan alert sukses dengan navigasi */
  private async showSuccessAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/tabs/tab2']);
        }
      }]
    });
    await alert.present();
  }
}