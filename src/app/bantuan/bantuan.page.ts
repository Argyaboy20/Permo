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
  // Ganti dengan URL server Anda, misalnya:
  apiUrl = 'http://127.0.0.1/api/action.php';
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

    const formData = {
      aksi: 'add_bantuan',
      username: this.bantuanForm.get('username')?.value,
      email: this.bantuanForm.get('email')?.value,
      kendala: this.bantuanForm.get('kendala')?.value
    };

    console.log('Sending data:', formData); // Untuk debugging

    this.http.post(this.apiUrl, formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        console.log('Response:', response); // Untuk debugging
        
        if (response.success) {
          this.showSuccessAlert('Sukses', 'Kendala berhasil dikirim');
          this.bantuanForm.reset();
        } else {
          this.showAlert('Error', response.message || 'Gagal mengirim kendala');
        }
      },
      error: (error) => {
        console.error('Error:', error); // Untuk debugging
        this.isSubmitting = false;
        this.showAlert('Error', 'Gagal mengirim data kendala. Silakan coba lagi.');
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
          this.router.navigate(['/tabs/tab2']);
        }
      }]
    });
    await alert.present();
  }
}