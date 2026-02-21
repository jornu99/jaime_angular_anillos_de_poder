import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Personaje } from '../interfaces/personaje';

@Injectable({
  providedIn: 'root',
})
export class PersonajesService {
  private apiESDLA = environment.apiESDLA;

  constructor(private http: HttpClient) { }

  obtenerPersonajes(): Observable<Personaje[]> {
    return this.http.get<Personaje[]>(`${this.apiESDLA}listaPersonajes`);
  }

  obtenerPersonaje(id: number): Observable<Personaje> {
    return this.http.get<Personaje>(`${this.apiESDLA}obtenerPersonaje/${id}`);
  }

  insertarPersonaje(personaje: Personaje): Observable<Personaje> {
    return this.http.post<Personaje>(`${this.apiESDLA}insertarPersonaje`, personaje);
  }

  actualizarPersonaje(id: number, personaje: Partial<Personaje>): Observable<Personaje> {
    return this.http.put<Personaje>(`${this.apiESDLA}actualizarPersonaje/${id}`, personaje);
  }

  bajaLogicaPersonaje(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiESDLA}bajaLogica/${id}`, {});
  }

  bajaFisica(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiESDLA}bajaFisica/${id}`, {});
  }

  reactivarPersonaje(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiESDLA}reactivar/${id}`, {});
  }
}
