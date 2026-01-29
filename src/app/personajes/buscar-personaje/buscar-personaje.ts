import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule
  ],
  templateUrl: './buscar-personaje.html',
  styleUrls: ['./buscar-personaje.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuscarPersonaje implements OnInit {

  personajes: Personaje[] = [];
  personajesFiltrados: Personaje[] = [];
  campoBusqueda: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(
    private personajeService: PersonajesService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPersonajes();
  }

  cargarPersonajes(): void {
    this.cargando = true;
    this.error = '';
    this.personajeService.obtenerPersonajes().subscribe({
      next: (data: Personaje[]) => {
        console.log('Personajes cargados:', data);
        this.personajes = data.map(p => ({
          ...p,
          fechaNacimiento: p.fechaNacimiento instanceof Date
            ? p.fechaNacimiento
            : new Date(p.fechaNacimiento)
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

  crearPersonaje():void {
    this.router.navigate(['/crearPersonaje']);
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

  eliminar(id: number): void {
    console.log('Eliminar personaje ID:', id);
  }
}
