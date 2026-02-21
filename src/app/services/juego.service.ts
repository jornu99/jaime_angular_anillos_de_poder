import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JuegoInterface } from '../interfaces/juego.interface';
import { Partida } from '../interfaces/partida';

@Injectable({
  providedIn: 'root',
})
export class JuegoService {
  private apiESDLA = environment.apiESDLA;

  constructor(private http: HttpClient) { }

  empezarPartida(): Observable<Partida> {
    return this.http.get<Partida>(`${this.apiESDLA}empezarPartida/`);
  }

  obtenerPregunta(id: number): Observable<JuegoInterface> {
    return this.http.get<JuegoInterface>(`${this.apiESDLA}obtenerPregunta/${id}`);
  }

  validarRespuesta(idPregunta: number, respuestaUsuario: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiESDLA}respuesta/${idPregunta}/?respuestaUsuario=${respuestaUsuario}`);
  }

  actualizarCorrectas(idPartida: number): Observable<Partida> {
    return this.http.put<Partida>(`${this.apiESDLA}correcta/${idPartida}/`, {});
  }

  finalizarPartida(idPartida: number): Observable<Partida> {
    return this.http.put<Partida>(`${this.apiESDLA}finalizar/${idPartida}/`, {});
  }

  obtenerEstadisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiESDLA}estadisticas`);
  }
}
