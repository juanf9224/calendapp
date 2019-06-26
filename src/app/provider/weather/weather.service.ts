import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  resourceUrl = 'api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) { }

  public getWeatherForeCast(city: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.resourceUrl}/q=${city}&appid=915f878deab393159ff608d531511c99`, {observe: 'response'});
  }
}
