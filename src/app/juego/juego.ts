import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag'
import { JuegoService } from '../services/juego.service';
import { EstadisticasJuego } from '../clases/estadisticas';
import { JuegoInterface } from '../interfaces/juego.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ProgressBarModule,
    DividerModule,
    TableModule,
    BadgeModule,
    TagModule
  ],
  templateUrl: './juego.html',
  styleUrls: ['./juego.css']
})
export class Juego implements OnInit {
  private estadisticas = new EstadisticasJuego();

  partidaId: number | null = null;
  preguntaActual: JuegoInterface | null = null;
  respuestas: string[] = [];
  racha = 0;
  procesando = false;
  cargandoEmpezar = false;
  juegoTerminado = false;
  victoria = false;
  derrota = false;
  preguntasUsadas: number[] = [];

  get totales() { return this.estadisticas.totales; }
  get historial() { return this.estadisticas.historial; }

  constructor(
    private juegoService: JuegoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  private actualizarEstadisticasDespues(ganada: boolean): void {
    Promise.resolve().then(() => {
      this.estadisticas.nuevaPartida(ganada);
      this.cdr.markForCheck();
    });
  }

  async empezar(): Promise<void> {
    if (this.cargandoEmpezar) return;
    this.cargandoEmpezar = true;

    try {
      const resultado = await firstValueFrom(this.juegoService.empezarPartida());
      if (!resultado || resultado.id == null) {
        throw new Error('Servidor no devolvió partida válida');
      }

      this.partidaId = resultado.id;
      this.preguntasUsadas = [];
      this.racha = 0;
      this.juegoTerminado = false;
      this.victoria = this.derrota = false;
      this.siguientePregunta();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error empezar partida:', error);
      this.partidaId = null;
      this.cdr.detectChanges();
    } finally {
      this.cargandoEmpezar = false;
      this.cdr.detectChanges();
    }
  }

  siguientePregunta(): void {
    const disponibles = Array.from({ length: 20 }, (_, i) => i + 1)
      .filter(id => !this.preguntasUsadas.includes(id));

    if (disponibles.length === 0) {
      this.derrota = true;
      this.juegoTerminado = true;
      if (this.partidaId != null) {
        this.juegoService.finalizarPartida(this.partidaId).subscribe({
          error: (err) => console.error('Error finalizar partida:', err)
        });
      }
      this.actualizarEstadisticasDespues(false);
      this.cdr.detectChanges();
      return;
    }

    const id = disponibles[Math.floor(Math.random() * disponibles.length)];
    this.preguntasUsadas.push(id);

    this.juegoService.obtenerPregunta(id).subscribe({
      next: (pregunta) => {
        this.preguntaActual = pregunta;
        this.respuestas = [
          pregunta.respuesta1, pregunta.respuesta2,
          pregunta.respuesta3, pregunta.respuesta4
        ];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error pregunta:', err);
        this.cdr.detectChanges();
      }
    });
  }

  async responder(indiceUsuario: number): Promise<void> {
    if (!this.partidaId || this.procesando || !this.preguntaActual) return;

    this.procesando = true;

    try {
      const numeroRespuesta = indiceUsuario + 1;
      const esCorrecta = await firstValueFrom(this.juegoService.validarRespuesta(
        this.preguntaActual.id, numeroRespuesta
      ));

      setTimeout(() => {
        if (esCorrecta) {
          this.racha++;
          firstValueFrom(this.juegoService.actualizarCorrectas(this.partidaId!)).then(async () => {
            if (this.racha >= 5) {
              await firstValueFrom(this.juegoService.finalizarPartida(this.partidaId!));
              this.aplicarFinPartida(true);
            } else {
              this.siguientePregunta();
            }
            this.cdr.detectChanges();
          }).catch(err => {
            console.error('Error actualizar correctas:', err);
            this.cdr.detectChanges();
          });
        } else {
          firstValueFrom(this.juegoService.finalizarPartida(this.partidaId!)).then(() => {
            this.aplicarFinPartida(false);
            this.cdr.detectChanges();
          }).catch(err => {
            console.error('Error finalizar partida:', err);
            this.aplicarFinPartida(false);
            this.cdr.detectChanges();
          });
        }
      }, 0);
    } catch (error) {
      console.error('Error respuesta:', error);
      this.cdr.detectChanges();
    } finally {
      this.procesando = false;
      this.cdr.detectChanges();
    }
  }

  private aplicarFinPartida(victoria: boolean): void {
    this.victoria = victoria;
    this.derrota = !victoria;
    this.juegoTerminado = true;
    this.actualizarEstadisticasDespues(victoria);
  }
}