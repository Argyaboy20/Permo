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
  private apiUrl = 'http://127.0.0.1/api/action.php';
  isSubmitting = false;

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

  ngOnInit() {}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bantuanForm.get(fieldName);
    return field!.invalid && (field!.dirty || field!.touched);
  }

  submitForm() {
    if (this.bantuanForm.invalid || this.isSubmitting) {
      this.showAlert('Error', 'Mohon lengkapi semua data dengan benar');
      return;
    }

    this.isSubmitting = true;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const formData = {
      aksi: 'validate_user',
      username: this.bantuanForm.get('username')?.value,
      email: this.bantuanForm.get('email')?.value
    };

    this.http.post(this.apiUrl, formData, { headers })
      .subscribe({
        next: (validationResponse: any) => {
          console.log('Validation response:', validationResponse);
          if (validationResponse.success) {
            this.submitBantuan(headers);
          } else {
            this.isSubmitting = false;
            this.showAlert('Error', validationResponse.message || 'Username atau email tidak terdaftar');
          }
        },
        error: (error) => {
          console.error('Validation error:', error);
          this.isSubmitting = false;
          this.showAlert('Error', 'Gagal melakukan validasi user');
        }
      });
  }

  private submitBantuan(headers: HttpHeaders) {
    const bantuanData = {
      aksi: 'add_bantuan',
      username: this.bantuanForm.get('username')?.value,
      email: this.bantuanForm.get('email')?.value,
      kendala: this.bantuanForm.get('kendala')?.value
    };

    this.http.post(this.apiUrl, bantuanData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Bantuan response:', response);
          this.isSubmitting = false;
          if (response.success) {
            this.showSuccessAlert('Sukses', 'Kendala berhasil dikirim');
          } else {
            this.showAlert('Error', response.message || 'Gagal mengirim kendala');
          }
        },
        error: (error) => {
          console.error('Submit bantuan error:', error);
          this.isSubmitting = false;
          this.showAlert('Error', 'Gagal mengirim data kendala');
        }
      });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showSuccessAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.bantuanForm.reset();
          this.router.navigate(['/tabs/tab2']);
        }
      }]
    });
    await alert.present();
  }
}