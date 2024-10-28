import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';



interface Main {
  aqi: number;
}

interface Component {
  co: number; // Monóxido de carbono
  no: number; // Óxido nítrico
  no2: number; // Dióxido de nitrogênio
  o3: number; // Ozônio
  so2: number; // Dióxido de enxofre
  pm2_5: number; // Material particulado fino
  pm10: number; // Material particulado
  nh3: number; // Amônia
}

export interface listItem {
  components: Component;
  dt: number;
  main: Main;
}

export interface apiResponse {
  coord: {
    long: number;
    lat: number;
  };
  list: listItem[];
}


const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class TempoService {

  constructor(private http: HttpClient) {}

 
  getCity(lat: number, long: number): Observable<any> {
    return this.http.get<any>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`
    ).pipe(
      catchError(error => {
        console.error('Erro ao buscar cidade:', error);
        return of(error);
      }));
  }

  getClima(lat: number, long: number): Observable<apiResponse> {
    return this.http.get<apiResponse>(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${apiKey}`
    ).pipe(
      catchError(error => {
        console.error('Erro ao buscar clima:', error);
       
        const errorResponse: apiResponse = {
          coord: {
            lat: lat,
            long: long,
          },
          list: [], 
        };

        return of(errorResponse);
      }))
  }
}

