import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

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
  userData: any;
  passwordErrors: any = {
    uppercase: true,
    lowercase: true,
    number: true,
    special: true,
    length: true
  };

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router
  ) {
    // Load user data saat komponen diinisialisasi
    const userDataStr = sessionStorage.getItem('currentUser');
    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
    } else {
      this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
    }
  }

  validatePassword(password: string): ValidationErrors | null {
    const errors: ValidationErrors = {};

    // Check for minimum length
    if (password.length < 6) {
      errors['length'] = true;
    }

    // Check for uppercase letters
    if (!/[A-Z]/.test(password)) {
      errors['uppercase'] = true;
    }

    // Check for lowercase letters
    if (!/[a-z]/.test(password)) {
      errors['lowercase'] = true;
    }

    // Check for numbers
    if (!/[0-9]/.test(password)) {
      errors['number'] = true;
    }

    // Check for special characters - simplified pattern
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
      errors['special'] = true;
    }

    return Object.keys(errors).length === 0 ? null : errors;
  }

  onPasswordChange(event: any) {
    const password = event.target.value;
    const errors = this.validatePassword(password);

    this.passwordErrors = {
      uppercase: errors?.['uppercase'] || false,
      lowercase: errors?.['lowercase'] || false,
      number: errors?.['number'] || false,
      special: errors?.['special'] || false,
      length: errors?.['length'] || false
    };
  }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  async changePassword() {
    if (this.isLoading) return;

    // Validasi dasar
    if (!this.oldPassword || !this.newPassword) {
      await this.showAlert('Peringatan', 'Mohon isi semua data');
      return;
    }

    if (this.oldPassword === this.newPassword) {
      await this.showAlert('Peringatan', 'Password baru harus berbeda dengan password lama');
      return;
    }

    const passwordErrors = this.validatePassword(this.newPassword);
    if (passwordErrors) {
      let errorMessage = 'Password baru harus memenuhi kriteria berikut:\n';
      if (passwordErrors['length']) errorMessage += '- Minimal 6 karakter\n';
      if (passwordErrors['uppercase']) errorMessage += '- Mengandung huruf kapital\n';
      if (passwordErrors['lowercase']) errorMessage += '- Mengandung huruf kecil\n';
      if (passwordErrors['number']) errorMessage += '- Mengandung angka\n';
      if (passwordErrors['special']) errorMessage += '- Mengandung karakter khusus\n';

      await this.showAlert('Peringatan', errorMessage);
      return;
    }

    // Pastikan userData ada
    if (!this.userData || !this.userData.id) {
      await this.showAlert('Error', 'Data pengguna tidak ditemukan');
      this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
      return;
    }

    this.isLoading = true;

    const data = {
      aksi: 'change_password',
      old_password: this.oldPassword,
      new_password: this.newPassword,
      user_id: this.userData.id // Menambahkan user_id ke request
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const apiUrl = 'http://127.0.0.1/api/action.php';

    try {
      const response = await this.http.post<any>(apiUrl, data, { headers }).toPromise();

      if (response && response.success) {
        // Update session storage dengan data user yang baru
        if (response.user) {
          sessionStorage.setItem('currentUser', JSON.stringify(response.user));
        }

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