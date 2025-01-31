import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  temperature: number = 0;
  humidity: number = 0;
  soilMoisture: number = 0;
  locationName: string = '';
  suitableCrops: any[] = [];
  errorMessage: string = '';
  isLocationEnabled: boolean = false;

  private crops = [
    { name: 'Sawit', idealTemp: '24-28°C', minTemp: 24, maxTemp: 28 },
    { name: 'Padi', idealTemp: '25-30°C', minTemp: 25, maxTemp: 30 },
    { name: 'Kedelai', idealTemp: '23-30°C', minTemp: 23, maxTemp: 30 },
    { name: 'Jambu Biji Kristal', idealTemp: '30°C', minTemp: 28, maxTemp: 32 },
    { name: 'Selada', idealTemp: '18-22°C', minTemp: 18, maxTemp: 22 },
    { name: 'Jagung', idealTemp: '21-34°C', minTemp: 21, maxTemp: 34 }
  ];

  // Gunakan environment variable untuk API key
  private readonly WEATHER_API_KEY = environment.weatherApiKey;
  private readonly WEATHER_API_URL = 'https://data.api.xweather.com/forecasts/:auto?format=json&filter=3hr&limit=7&fields=periods.maxTempC,loc,periods.minTempC,periods.weather,periods.minHumidity,periods.maxHumidity&client_id=HE8pD71uXLahgk3jpnVLp&client_secret=JP97rR0GHR5792BnhOOuKr0zryWT65VAfxZp06mX';

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    this.platform.resume.subscribe(async () => {
      // Check permissions again when app resumes
      await this.initializeApp();
    });
    await this.initializeApp();
  }

  private async initializeApp() {
    try {
      await this.checkPermissions();
      if (this.isLocationEnabled) {
        await this.getCurrentLocation();
        
        // Update setiap 5 menit
        setInterval(() => {
          this.getCurrentLocation();
        }, 300000);
      }
    } catch (error) {
      console.error('Error in initialization:', error);
      this.handleError(error);
    }
  }

  async checkPermissions() {
    try {
      const status = await Geolocation.checkPermissions();
      
      if (status.location === 'prompt' || status.location === 'prompt-with-rationale') {
        const permission = await Geolocation.requestPermissions();
        this.isLocationEnabled = permission.location === 'granted';
      } else {
        this.isLocationEnabled = status.location === 'granted';
      }

      if (!this.isLocationEnabled) {
        await this.showLocationPermissionAlert();
      }
    } catch (error) {
      console.error('Permission error:', error);
      this.handleError(new Error('Izin lokasi diperlukan'));
    }
  }

  async getCurrentLocation(event?: any) {
    if (!this.isLocationEnabled) {
      this.handleError(new Error('Izin lokasi tidak diberikan'));
      if (event) event.target.complete();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Mengambil data cuaca...',
      duration: 10000 // timeout after 10 seconds
    });
    await loading.present();

    try {
      const coordinates = await Geolocation.getCurrentPosition({
        timeout: 5000,
        enableHighAccuracy: true
      });

      await this.getWeatherData(coordinates.coords.latitude, coordinates.coords.longitude);
      this.updateCropRecommendations();
      this.errorMessage = ''; // Clear any previous error messages
    } catch (error) {
      this.handleError(error);
    } finally {
      loading.dismiss();
      if (event) event.target.complete();
    }
  }

  private async getWeatherData(lat: number, lon: number) {
    if (!this.WEATHER_API_KEY) {
      throw new Error('API key tidak ditemukan');
    }

    const url = `${this.WEATHER_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${this.WEATHER_API_KEY}`;
    
    try {
      const response: any = await this.http.get(url).toPromise();
      
      if (!response || !response.main) {
        throw new Error('Data cuaca tidak valid');
      }

      this.temperature = Math.round(response.main.temp);
      this.humidity = response.main.humidity;
      this.locationName = response.name;
      this.soilMoisture = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
    } catch (error) {
      throw new Error('Gagal mengambil data cuaca');
    }
  }

  private updateCropRecommendations() {
    this.suitableCrops = this.crops.filter(crop => 
      this.temperature >= crop.minTemp && 
      this.temperature <= crop.maxTemp &&
      this.soilMoisture >= 50 && 
      this.soilMoisture <= 70
    );
  }

  private async showLocationPermissionAlert() {
    const alert = await this.alertController.create({
      header: 'Izin Lokasi Diperlukan',
      message: 'Aplikasi ini memerlukan akses ke lokasi Anda untuk menampilkan informasi cuaca yang akurat. Mohon aktifkan izin lokasi di pengaturan perangkat Anda.',
      buttons: [
        {
          text: 'Buka Pengaturan',
          handler: () => {
            // Buka pengaturan lokasi perangkat
            if (this.platform.is('android')) {
              window.open('location-settings:');
            } else if (this.platform.is('ios')) {
              window.open('app-settings:');
            }
          }
        },
        {
          text: 'Batal',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  private async handleError(error: any) {
    console.error('Application error:', error);
    
    let message = 'Terjadi kesalahan yang tidak diketahui';
    
    if (error.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Update error message for display in template
    this.errorMessage = message;

    // Show alert for critical errors
    if (message.includes('Izin lokasi') || message.includes('API key')) {
      const alert = await this.alertController.create({
        header: 'Peringatan',
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}