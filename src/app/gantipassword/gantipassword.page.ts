import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-gantipassword',
  templateUrl: './gantipassword.page.html',
  styleUrls: ['./gantipassword.page.scss'],
})
export class GantipasswordPage implements OnInit {
  oldPassword: string = '';
  newPassword: string = '';
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  username: string = '';
  isLoading: boolean = false;
  private storage: Storage | null = null;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private storageService: Storage,
    private router: Router
  ) { }

  async ngOnInit() {
    this.storage = await this.storageService.create();
    await this.loadUsername();
  }

  private async loadUsername() {
    const username = await this.storage?.get('username');
    if (username) {
      this.username = username;
    }
  }

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  async changePassword() {
    if (this.isLoading) return;

    if (!this.oldPassword || !this.newPassword) {
      await this.showAlert('Peringatan', 'Semua field harus diisi');
      return;
    }

    if (this.newPassword.length < 6) {
      await this.showAlert('Peringatan', 'Password baru minimal 6 karakter');
      return;
    }

    this.isLoading = true;

    const data = {
      aksi: 'change_password',
      username: this.username,
      old_password: this.oldPassword,
      new_password: this.newPassword
    };

    const apiUrl = 'http://127.0.0.1/api/action.php';

    this.http.post<PasswordChangeResponse>(apiUrl, data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: async (response) => {
          if (response.success) {
            await this.showAlert('Sukses', response.message);
            this.oldPassword = '';
            this.newPassword = '';
          } else {
            await this.showAlert('Peringatan', response.message);
          }
        },
        error: async (error: HttpErrorResponse) => {
          let message = 'Terjadi kesalahan sistem';
          if (error.error?.message) {
            message = error.error.message;
          }
          await this.showAlert('Error', message);
        }
      });
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