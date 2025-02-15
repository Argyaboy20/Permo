import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-gantipassword',
  templateUrl: './gantipassword.page.html',
  styleUrls: ['./gantipassword.page.scss'],
})
export class GantipasswordPage implements OnInit {
  passwordForm!: FormGroup; // Add definite assignment assertion
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  isLoading: boolean = false;
  userData: any;
  passwordErrors: any = {
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    length: false
  };

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // Load user data saat komponen diinisialisasi
    const userDataStr = sessionStorage.getItem('currentUser');
    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
    } else {
      this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
    }
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, this.passwordValidator()]]
    });
  }

  passwordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) {
        return null;
      }

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

      // Update the error state for UI display
      this.updatePasswordErrors(errors);

      return Object.keys(errors).length === 0 ? null : errors;
    };
  }

  updatePasswordErrors(errors: ValidationErrors | null) {
    if (!errors) {
      this.passwordErrors = {
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        length: false
      };
    } else {
      this.passwordErrors = {
        uppercase: errors['uppercase'] || false,
        lowercase: errors['lowercase'] || false,
        number: errors['number'] || false,
        special: errors['special'] || false,
        length: errors['length'] || false
      };
    }
  }

  onPasswordChange(event: any) {
    const password = event.detail.value;
    const control = this.passwordForm.get('newPassword');
    
    if (control) {
      // Re-validate when password changes
      control.updateValueAndValidity();
    }
  }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  oldPasswordSameAsNew() {
    const oldPassword = this.passwordForm.get('oldPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    return oldPassword && newPassword && oldPassword === newPassword;
  }

  async changePassword() {
    if (this.isLoading || !this.passwordForm.valid) return;

    const oldPassword = this.passwordForm.get('oldPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;

    // Validasi dasar
    if (!oldPassword || !newPassword) {
      await this.showAlert('Peringatan', 'Mohon isi semua data');
      return;
    }

    if (oldPassword === newPassword) {
      await this.showAlert('Peringatan', 'Password baru harus berbeda dengan password lama');
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
      old_password: oldPassword,
      new_password: newPassword,
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
        this.passwordForm.reset();
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