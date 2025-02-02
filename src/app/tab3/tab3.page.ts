import { Component, OnInit, OnDestroy } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { catchError, timeout } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnDestroy {
  temperature: number | null = null;
  humidity: number | null = null;
  soilMoisture: number | null = null;
  locationName: string = '';
  suitableCrops: any[] = [];
  errorMessage: string = '';
  isLocationEnabled: boolean = false;
  isLoading: boolean = false;
  currentTime: string = '';
  private timeInterval: any;

  //isi rekomendasi tanaman
  private crops = [
    { 
      name: 'Sawit', 
      idealTemp: '24-28°C', 
      minTemp: 24, 
      maxTemp: 28,
      minHumidity: 80,
      maxHumidity: 90 
    },
    { 
      name: 'Padi', 
      idealTemp: '22-38°C', 
      minTemp: 22, 
      maxTemp: 28,
      minHumidity: 76,
      maxHumidity: 86 
    },
    { 
      name: 'Kedelai', 
      idealTemp: '20-30°C', 
      minTemp: 20, 
      maxTemp: 30,
      minHumidity: 75,
      maxHumidity: 90 
    },
    { 
      name: 'Jambu Biji', 
      idealTemp: '23-28°C', 
      minTemp: 23, 
      maxTemp: 28,
      minHumidity: 30,
      maxHumidity: 50 
    },
    { 
      name: 'Selada', 
      idealTemp: '18-22°C', 
      minTemp: 18, 
      maxTemp: 22,
      minHumidity: 80,
      maxHumidity: 90 
    },
    { 
      name: 'Jagung', 
      idealTemp: '21-34°C', 
      minTemp: 21, 
      maxTemp: 34,
      minHumidity: 80,
      maxHumidity: 80 
    },
    { 
      name: 'Mangga', 
      idealTemp: '21-29°C', 
      minTemp: 21, 
      maxTemp: 29,
      minHumidity: 85,
      maxHumidity: 90 
    },
    { 
      name: 'Jeruk', 
      idealTemp: '20-38°C', 
      minTemp: 20, 
      maxTemp: 38,
      minHumidity: 70,
      maxHumidity: 80 
    },
    { 
      name: 'Salak', 
      idealTemp: '20-30°C', 
      minTemp: 20, 
      maxTemp: 30,
      minHumidity: 40,
      maxHumidity: 70 
    }
  ];

  //API WEATHER
  private readonly WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';
  private readonly WEATHER_API_KEY = environment.weatherApiKey;
  private readonly API_TIMEOUT = 15000;

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.initializeLocation();
    this.startClock();
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private startClock() {
    // Update time immediately
    this.updateTime();
    // Then update every second
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  private async initializeLocation() {
    try {
      const status = await Geolocation.checkPermissions();
      
      if (status.location === 'granted') {
        this.isLocationEnabled = true;
        await this.getCurrentLocation();
      } else {
        await this.requestLocationPermission();
      }
    } catch (error) {
      console.error('Initialization error:', error);
      this.handleError('Mohon aktifkan GPS Anda');
    }
  }

  private async requestLocationPermission() {
    try {
      const permission = await Geolocation.requestPermissions();
      this.isLocationEnabled = permission.location === 'granted';
      
      if (this.isLocationEnabled) {
        await this.getCurrentLocation();
      } else {
        await this.showLocationPermissionAlert();
      }
    } catch (error) {
      console.error('Permission request error:', error);
      this.handleError('Silakan aktifkan izin lokasi di pengaturan');
    }
  }

  async getCurrentLocation(event?: any) {
    try {
      this.errorMessage = '';
      this.isLoading = true;

      const coordinates = await Geolocation.getCurrentPosition({
        timeout: 30000,
        enableHighAccuracy: true
      });

      if (coordinates && coordinates.coords) {
        await this.getWeatherData(coordinates.coords.latitude, coordinates.coords.longitude);
        this.updateCropRecommendations();
      } else {
        throw new Error('Koordinat tidak valid');
      }
    } catch (error: any) {
      console.error('Location error:', error);
      this.handleLocationError(error);
    } finally {
      this.isLoading = false;
      if (event) {
        event.target.complete();
      }
    }
  }

  private handleLocationError(error: any) {
    if (error.code === 1) {
      this.showLocationPermissionAlert();
    } else if (error.code === 2) {
      this.handleError('GPS tidak aktif. Mohon aktifkan GPS Anda');
    } else if (error.code === 3) {
      this.handleError('Koneksi timeout. Periksa koneksi internet Anda');
    } else if (error.message) {
      this.handleError(error.message);
    } else {
      this.handleError('Terjadi kesalahan saat mengakses lokasi');
    }
  }

  private getWeatherData(lat: number, lon: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.WEATHER_API_KEY) {
        this.handleError('API key tidak ditemukan');
        reject(new Error('API key tidak ditemukan'));
        return;
      }

      const params = new HttpParams()
        .set('key', this.WEATHER_API_KEY)
        .set('q', `${lat},${lon}`);

      const headers = new HttpHeaders()
        .set('Accept', 'application/json');

      this.http.get<any>(this.WEATHER_API_URL, { params, headers })
        .pipe(
          timeout(this.API_TIMEOUT),
          catchError(this.handleApiError.bind(this))
        )
        .subscribe({
          next: (response) => {
            if (response && response.current) {
              this.temperature = Math.round(response.current.temp_c);
              this.humidity = response.current.humidity;
              this.locationName = response.location.name;
              this.soilMoisture = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
              resolve();
            } else {
              const error = new Error('Data cuaca tidak lengkap');
              this.handleError(error.message);
              reject(error);
            }
          },
          error: (error) => {
            this.handleError(error.message);
            reject(error);
          }
        });
    });
  }

  private handleApiError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Terjadi kesalahan saat mengambil data cuaca';
    
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          errorMessage = 'API key tidak valid';
          break;
        case 403:
          errorMessage = 'Kuota API telah habis atau dibatasi';
          break;
        case 429:
          errorMessage = 'Terlalu banyak permintaan ke API';
          break;
        case 0:
          errorMessage = 'Tidak ada koneksi internet';
          break;
        default:
          if (error.error && error.error.error && error.error.error.message) {
            errorMessage = error.error.error.message;
          }
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  private updateCropRecommendations() {
    if (this.temperature === null || this.humidity === null) return;
    
    this.suitableCrops = this.crops.filter(crop => 
      this.temperature! >= crop.minTemp && 
      this.temperature! <= crop.maxTemp &&
      this.humidity! >= crop.minHumidity &&
      this.humidity! <= crop.maxHumidity &&
      this.soilMoisture! >= 50 && 
      this.soilMoisture! <= 70
    );
  }

  private async showLocationPermissionAlert() {
    const alert = await this.alertController.create({
      header: 'Izin Lokasi Diperlukan',
      message: 'Aplikasi ini memerlukan akses ke lokasi Anda untuk menampilkan informasi cuaca yang akurat.',
      buttons: [
        {
          text: 'Buka Pengaturan',
          handler: () => {
            if (this.platform.is('android')) {
              window.open('location-settings:');
            } else if (this.platform.is('ios')) {
              window.open('app-settings:');
            }
          }
        },
        {
          text: 'Coba Lagi',
          handler: () => {
            this.initializeLocation();
          }
        }
      ]
    });
    await alert.present();
  }

  private handleError(message: string) {
    this.errorMessage = message;
    this.isLoading = false;
  }
}