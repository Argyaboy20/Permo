import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  temperature: number | null = null;
  humidity: number | null = null;
  soilMoisture: number | null = null;
  locationName: string = '';
  suitableCrops: any[] = [];
  errorMessage: string = '';
  isLocationEnabled: boolean = false;
  isLoading: boolean = false;

  private crops = [
    { name: 'Sawit', idealTemp: '24-28°C', minTemp: 24, maxTemp: 28 },
    { name: 'Padi', idealTemp: '25-30°C', minTemp: 25, maxTemp: 30 },
    { name: 'Kedelai', idealTemp: '23-30°C', minTemp: 23, maxTemp: 30 },
    { name: 'Jambu Biji Kristal', idealTemp: '30°C', minTemp: 28, maxTemp: 32 },
    { name: 'Selada', idealTemp: '18-22°C', minTemp: 18, maxTemp: 22 },
    { name: 'Jagung', idealTemp: '21-34°C', minTemp: 21, maxTemp: 34 }
  ];

  private readonly WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';
  private readonly WEATHER_API_KEY = environment.weatherApiKey;
  private readonly API_TIMEOUT = 15000; // Increased timeout to 15 seconds

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.initializeLocation();
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

  private async getWeatherData(lat: number, lon: number): Promise<void> {
    try {
      // Membuat parameter query
      const params = new HttpParams()
        .set('key', this.WEATHER_API_KEY)
        .set('q', `${lat},${lon}`);

      // Membuat header request
      const headers = new HttpHeaders()
        .set('Accept', 'application/json');

      const response = await this.http.get<any>(this.WEATHER_API_URL, { params, headers })
        .pipe(
          timeout(10000),
          catchError((error) => {
            console.error('API Error:', error);
            let message = 'Gagal mengambil data cuaca';
            
            if (error.status === 401) {
              message = 'Kesalahan autentikasi API';
            } else if (error.status === 403) {
              message = 'Akses API ditolak';
            } else if (!navigator.onLine) {
              message = 'Tidak ada koneksi internet';
            }
            
            return throwError(() => new Error(message));
          })
        )
        .toPromise();

      if (response && response.current) {
        this.temperature = Math.round(response.current.temp_c);
        this.humidity = response.current.humidity;
        this.locationName = response.location.name;
        this.soilMoisture = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
      } else {
        throw new Error('Data cuaca tidak lengkap');
      }
    } catch (error: any) {
      console.error('Weather data error:', error);
      throw error;
    }
  }

  private updateCropRecommendations() {
    if (this.temperature === null) return;
    
    this.suitableCrops = this.crops.filter(crop => 
      this.temperature! >= crop.minTemp && 
      this.temperature! <= crop.maxTemp &&
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