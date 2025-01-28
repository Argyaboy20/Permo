import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gantipassword',
  templateUrl: './gantipassword.page.html',
  styleUrls: ['./gantipassword.page.scss'],
})
export class GantipasswordPage {
  oldPassword: string = '';
  newPassword: string = '';
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router
  ) {}

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  async changePassword() {
    if (this.isLoading) return;

    if (!this.oldPassword || !this.newPassword) {
      await this.showAlert('Peringatan', 'Mohon isi semua field');
      return;
    }

    if (this.oldPassword === this.newPassword) {
      await this.showAlert('Peringatan', 'Password baru harus berbeda dengan password lama');
      return;
    }

    if (this.newPassword.length < 6) {
      await this.showAlert('Peringatan', 'Password minimal 6 karakter');
      return;
    }

    this.isLoading = true;

    const data = {
      aksi: 'change_password',
      old_password: this.oldPassword,
      new_password: this.newPassword
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const apiUrl = 'http://127.0.0.1/api/action.php';

    try {
      const response = await this.http.post<any>(apiUrl, data, { headers }).toPromise();

      if (response && response.success) {
        await this.showAlert('Sukses', 'Password berhasil diubah');
        this.oldPassword = '';
        this.newPassword = '';
        this.router.navigate(['/tabs/tab2']);
      } else {
        await this.showAlert('Peringatan', response?.message || 'Gagal mengubah password');
      }
    } catch (error) {
      console.error('Error:', error);
      await this.showAlert('Error', 'Terjadi kesalahan sistem');
    } finally {
      this.isLoading = false;
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}