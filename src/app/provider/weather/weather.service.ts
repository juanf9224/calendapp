import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  resourceUrl = 'http://api.openweathermap.org/data/2.5/forecast/';

  constructor(private http: HttpClient) { }

  public fetchWeatherForeCast(city: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}`, {
      params: {
      q: `${city}`,
      appid: environment.openWeatherAppApiKey
      },
      observe: 'response'
    });
  }
}
