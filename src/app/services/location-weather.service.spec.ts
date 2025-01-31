import { TestBed } from '@angular/core/testing';

import { LocationWeatherService } from './location-weather.service';

describe('LocationWeatherService', () => {
  let service: LocationWeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationWeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
