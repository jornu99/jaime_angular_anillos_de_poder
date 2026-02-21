import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { PersonajesService } from '../../services/personajes.service';
import { Personaje } from '../../interfaces/personaje';

@Component({
  selector: 'app-buscar-personaje',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    CardModule,
    TooltipModule,
    BadgeModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './buscar-personaje.html',
  styleUrls: ['./buscar-personaje.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class BuscarPersonaje implements OnInit {
  personajes: Personaje[] = [];
  personajesFiltrados: Personaje[] = [];
  campoBusqueda: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(
    private personajesService: PersonajesService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.cargarPersonajes();
  }

  cargarPersonajes(): void {
    this.cargando = true;
    this.error = '';
    this.personajesService.obtenerPersonajes().subscribe({
      next: (data: Personaje[]) => {
        console.log('Personajes cargados:', data);
        this.personajes = data.map(p => ({
          ...p,
          fechaNacimiento: p.fechaNacimiento instanceof Date
            ? p.fechaNacimiento
            : new Date(p.fechaNacimiento),
          fechaBaja: p.fechaBaja instanceof Date
            ? p.fechaBaja
            : p.fechaBaja
              ? new Date(p.fechaBaja)
              : null,
          estado: p.fechaBaja ? 'INACTIVO' : 'ACTIVO'
        }));
        this.personajesFiltrados = [...this.personajes];
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando personajes:', err);
        this.error = 'Error al cargar personajes: ' + err.message;
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  severidadCorrupcion(nivel: number): 'success' | 'info' | 'warn' | 'danger' {
    if (nivel >= 75) return 'danger';
    if (nivel >= 50) return 'warn';
    if (nivel >= 25) return 'info';
    if (nivel >= 0) return 'success';
    return 'success';
  }

  buscar(): void {
    console.log('Buscando:', this.campoBusqueda);

    const termino = this.campoBusqueda.toLowerCase().trim();

    if (!termino) {
      this.personajesFiltrados = [...this.personajes];
      this.cdr.markForCheck();
      return;
    }

    if (this.personajes.length === 0) {
      console.log('No hay personajes para filtrar');
      return;
    }

    this.personajesFiltrados = this.personajes.filter(personaje =>
      personaje.nombre.toLowerCase().includes(termino) ||
      personaje.raza.toLowerCase().includes(termino) ||
      personaje.nivelCorrupcion.toString().includes(termino)
    );

    console.log(`Encontrados ${this.personajesFiltrados.length} personajes`);
    this.cdr.markForCheck();
  }

  insertarPersonaje(): void {
    this.router.navigate(['/insertarPersonaje']);
  }

  limpiar(): void {
    this.campoBusqueda = '';
    this.personajesFiltrados = [...this.personajes];
    this.cdr.markForCheck();
  }

  editar(id: number): void {
    console.log('Editando personaje ID:', id);
    this.router.navigate(['personaje', 'editar', id]);
  }

  private recargarPersonajesDespuesDeCambio() {
    this.cargarPersonajes();
  }

  bajaFisica(personaje: Personaje): void {
    this.confirmationService.confirm({
      message: 'Se va a borrar de forma definitiva el registro. ¿Estás seguro que deseas borrarlo?',
      header: 'Baja física',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.personajesService.bajaFisica(personaje.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Baja física',
              detail: 'El personaje se ha borrado correctamente'
            });
            this.recargarPersonajesDespuesDeCambio();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al borrar',
              detail: 'No se puede borrar ese personaje porque es portador.'
            });
            console.error('Error en baja física', err)
          }
        });
      },
      reject: () => { }
    });
  }

  bajaLogicaPersonaje(personaje: Personaje): void {
    this.confirmationService.confirm({
      message: 'Se va a dar de baja el personaje. ¿Estás seguro?',
      header: 'Baja lógica',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.personajesService.bajaLogicaPersonaje(personaje.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Baja lógica',
              detail: 'Se ha dado de baja correctamente.'
            });
            this.recargarPersonajesDespuesDeCambio();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se ha podido dar de baja el personaje.'
            });
            console.error('Error en baja lógica', err);
          }
        });
      },
      reject: () => { }
    });
  }

  reactivarPersonaje(personaje: Personaje): void {
    this.confirmationService.confirm({
      message: '¿Deseas reactivar el personaje?',
      header: 'Reactivar personaje',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.personajesService.reactivarPersonaje(personaje.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Reactivado',
              detail: 'El personaje ha sido reactivado correctamente.'
            });
            this.recargarPersonajesDespuesDeCambio();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se ha podido reactivar el personaje.'
            });
            console.error('Error al reactivar', err);
          }
        });
      },
      reject: () => { }
    });
  }
}
