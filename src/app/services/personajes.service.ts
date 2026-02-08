import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Personaje } from '../interfaces/personaje';

@Injectable({
  providedIn: 'root',
})
export class PersonajesService {
  private baseUrl = environment.apiESDLA;

  constructor(private http: HttpClient) { }

  obtenerPersonajes(): Observable<Personaje[]> {
    return this.http.get<Personaje[]>(`${this.baseUrl}listaPersonajes`);
  }

  obtenerPersonaje(id: number): Observable<Personaje> {
    return this.http.get<Personaje>(`${this.baseUrl}obtenerPersonaje/${id}`);
  }

  insertarPersonaje(personaje: Personaje): Observable<Personaje> {
    return this.http.post<Personaje>(`${this.baseUrl}insertarPersonaje`, personaje);
  }

  actualizarPersonaje(id: number, personaje: Partial<Personaje>): Observable<Personaje> {
    return this.http.put<Personaje>(`${this.baseUrl}actualizarPersonaje/${id}`, personaje);
  }

  bajaLogicaPersonaje(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}bajaLogica/${id}`, {});
  }

  bajaFisica(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}bajaFisica/${id}`, {});
  }

  reactivarPersonaje(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}reactivar/${id}`, {});
  }
}
