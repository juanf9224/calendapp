import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  resourceUrl = 'api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  getWeatherForeCast(city: string): Observable<HttpResponse<any>> {
    return this.http.get(`${this.resourceUrl}/q=${city}`, {observe: 'response'});
  }
}
