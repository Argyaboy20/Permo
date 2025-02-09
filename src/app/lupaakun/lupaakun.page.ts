import { Component, OnInit } from '@angular/core';
import { PostProvider } from '../../provider/post-provider';
import { ToastController, LoadingController } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-lupaakun',
  templateUrl: './lupaakun.page.html',
  styleUrls: ['./lupaakun.page.scss'],
})
export class LupaakunPage implements OnInit {
  email: string = '';
  isLoading: boolean = false;

  constructor(
    private postPvdr: PostProvider,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async kirimInformasi() {
    if (this.isLoading) return;

    let loading: HTMLIonLoadingElement | null = null;

    try {
      // Validasi input
      if (!this.email) {
        await this.presentToast('Harap isi email');
        return;
      }

      if (!this.validateEmail(this.email)) {
        await this.presentToast('Format email tidak valid');
        return;
      }

      this.isLoading = true;
      loading = await this.loadingController.create({
        message: 'Mengirim informasi...',
        spinner: 'circles',
        backdropDismiss: false
      });
      await loading.present();

      const body = {
        email: this.email.trim(),
        aksi: 'lupa_akun'
      };

      const response = await this.postPvdr.postData(body, 'action.php')
        .pipe(
          tap(response => {
            console.log('Raw server response:', response);
          }),
          catchError(error => {
            console.error('API Error:', error);
            
            if (error.error instanceof ErrorEvent) {
              // Client-side error
              return throwError(() => new Error(error.error.message));
            }
            
            // If we have a response body
            if (error.error) {
              // Try to parse it if it's a string
              if (typeof error.error === 'string') {
                try {
                  const parsedError = JSON.parse(error.error);
                  return throwError(() => new Error(parsedError.message || 'Server error'));
                } catch (e) {
                  // If we can't parse it, return the raw error
                  return throwError(() => new Error(error.error));
                }
              }
              // If it's already an object
              if (error.error.message) {
                return throwError(() => new Error(error.error.message));
              }
            }
            
            return throwError(() => new Error('Gagal terhubung ke server. Silakan coba lagi nanti.'));
          })
        )
        .toPromise();

      console.log('Processed response:', response);

      if (response && response.success) {
        await this.presentToast(response.message || 'Informasi akun telah dikirim ke email');
        this.email = '';
      } else if (response && response.message) {
        throw new Error(response.message);
      } else {
        throw new Error('Gagal mengirim informasi ke email');
      }

    } catch (error: any) {
      console.error('Final error:', error);
      await this.presentToast(error.message || 'Terjadi kesalahan. Silakan coba lagi nanti.');
    } finally {
      this.isLoading = false;
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  private validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}