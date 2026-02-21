import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Portador } from '../interfaces/portador';

@Injectable({
  providedIn: 'root',
})
export class PortadoresService {
  private apiESDLA = environment.apiESDLA;

  constructor(private http: HttpClient) { }

  obtenerPortadores(): Observable<Portador[]> {
    return this.http.get<Portador[]>(`${this.apiESDLA}listaPortadores`);
  }

  obtenerPortador(id: number): Observable<Portador> {
    return this.http.get<Portador>(`${this.apiESDLA}obtenerPortador/${id}`);
  }
}
