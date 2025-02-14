import { Component, OnInit, OnDestroy } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { catchError, timeout } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

interface CropRecommendation {
  id: number;
  datatumbuhan: string;
  suhu: string;
  suhu_min: number;
  suhu_max: number;
  udara: string;
  udara_min: number;
  udara_max: number;
  lembabtanah: string;
}

// New interfaces for Nominatim response
interface NominatimAddress {
  village?: string;
  suburb?: string;
  town?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface NominatimResponse {
  address: NominatimAddress;
  display_name: string;
}


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
  suitableCrops: CropRecommendation[] = [];
  errorMessage: string = '';
  isLocationEnabled: boolean = false;
  isLoading: boolean = false;
  currentTime: string = '';
  private timeInterval: any;
  weatherCondition: string = '';
  weatherIcon: string = '';

  private readonly BASE_API_URL = environment.baseApiUrl;
  private readonly WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';
  private readonly WEATHER_API_KEY = environment.weatherApiKey;
  private readonly API_TIMEOUT = 15000;
  private readonly GEOCODING_API_URL = 'https://nominatim.openstreetmap.org/reverse';
  private readonly LOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 0
  };

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private platform: Platform
  ) { }

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

  private getWeatherCondition(temp: number): { condition: string, icon: string } {
    if (temp >= 35) {
      return { condition: 'Cerah Panas', icon: 'sunny' }; 
    } else if (temp >= 30) {
      return { condition: 'Cerah', icon: 'sunny-outline' };
    } else if (temp >= 25) {
      return { condition: 'Cerah Berawan', icon: 'partly-sunny-outline' };
    } else if (temp >= 20) {
      return { condition: 'Berawan', icon: 'cloudy-outline' };
    } else if (temp >= 15) {
      return { condition: 'Sejuk', icon: 'thermometer-outline' };
    } else {
      return { condition: 'Dingin', icon: 'snow-outline' };
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

  private async getDetailedLocation(latitude: number, longitude: number): Promise<string> {
    try {
      const params = new HttpParams()
        .set('format', 'json')
        .set('lat', latitude.toString())
        .set('lon', longitude.toString())
        .set('zoom', '18')
        .set('addressdetails', '1');

      const headers = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('User-Agent', 'PertanianMobile');

      const response = await this.http.get<NominatimResponse>(
        this.GEOCODING_API_URL, 
        { params, headers }
      ).toPromise();
      
      if (response && response.address) {
        const address = response.address;
        const parts: string[] = [];

        // Build detailed location string
        if (address.village) parts.push(address.village);
        if (address.suburb) parts.push(address.suburb);
        if (address.town) parts.push(address.town);
        if (address.city) parts.push(address.city);
        if (address.state) parts.push(address.state);

        return parts.length > 0 ? parts.join(', ') : response.display_name;
      }
      throw new Error('Location details not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      return this.locationName; // Fallback to weather API location
    }
  }

  async getCurrentLocation(event?: any) {
    try {
      this.errorMessage = '';
      this.isLoading = true;

      const coordinates = await Geolocation.getCurrentPosition(this.LOCATION_OPTIONS);

      if (coordinates && coordinates.coords) {
        const { latitude, longitude } = coordinates.coords;
        
        // Get detailed location name first
        this.locationName = await this.getDetailedLocation(latitude, longitude);
        
        // Then get weather data
        await this.getWeatherData(latitude, longitude);
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

               // Add null check before calling getWeatherCondition
               if (this.temperature !== null) {
                const weatherInfo = this.getWeatherCondition(this.temperature);
                this.weatherCondition = weatherInfo.condition;
                this.weatherIcon = weatherInfo.icon;
              } else {
                console.warn('Temperature is null');
                this.weatherCondition = 'Tidak tersedia';
                this.weatherIcon = 'help-outline';
              }

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
    if (this.temperature === null || this.humidity === null) {
      console.error('Weather data is incomplete');
      return;
    }

    const requestData = {
      aksi: 'get_crop_recommendations',
      temperature: this.temperature.toString(),
      humidity: this.humidity.toString()
    };

    console.log('Sending request:', {
      url: `${this.BASE_API_URL}/action.php`,
      data: requestData
    });

    this.http.post<any>(`${this.BASE_API_URL}/action.php`, JSON.stringify(requestData), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    }).pipe(
      timeout(10000),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        let errorMessage = 'Terjadi kesalahan saat mengambil rekomendasi';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          errorMessage = error.error.message;
        } else {
          switch (error.status) {
            case 0:
              errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
              break;
            case 404:
              errorMessage = 'API endpoint tidak ditemukan.';
              break;
            case 500:
              errorMessage = 'Terjadi kesalahan pada server.';
              break;
            default:
              errorMessage = `Kesalahan: ${error.message}`;
          }
        }
        return throwError(() => new Error(errorMessage));
      })
    ).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (response.success && Array.isArray(response.result)) {
          this.suitableCrops = response.result.map((crop: any) => ({
            id: crop.id,
            datatumbuhan: crop.datatumbuhan,
            suhu: `${crop.suhu_min}-${crop.suhu_max}°C`,
            udara: `${crop.udara_min}-${crop.udara_max}%`,
            lembabtanah: crop.lembabtanah,
            suhu_min: parseFloat(crop.suhu_min),
            suhu_max: parseFloat(crop.suhu_max),
            udara_min: parseFloat(crop.udara_min),
            udara_max: parseFloat(crop.udara_max)
          }));

          console.log('Processed crops:', this.suitableCrops);
        } else {
          this.suitableCrops = [];
          console.warn('No recommendations found:', response.message);
        }
      },
      error: (error: Error) => {
        this.handleError(error.message);
        this.suitableCrops = [];
      }
    });
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