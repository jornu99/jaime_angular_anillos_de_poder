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
import { Portador } from '../interfaces/portador';
import { PortadoresService } from '../services/portadores.service';

@Component({
  selector: 'app-portadores',
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
  templateUrl: './portadores.html',
  styleUrl: './portadores.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class Portadores implements OnInit {
  portadores: Portador[] = [];
  portadoresFiltrados: Portador[] = [];
  campoBusqueda: string = '';
  error: string = '';
  cargando: boolean = false;
  private readonly LOCAL_KEY = 'Portadores';

  constructor(
    private portadoresService: PortadoresService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.cargarPortadores();
  }

  private portadorPreparado(data: any[]): Portador[] {
    return data.map((p: any) => ({
      ...p,
      fechaInicio: p.fechaInicio instanceof Date
        ? p.fechaInicio
        : new Date(p.fechaInicio),
      fechaFin: p.fechaFin instanceof Date
        ? p.fechaFin
        : p.fechaFin
          ? new Date(p.fechaFin)
          : null,
      estado: !p.fechaFin
    }));
  }

  cargarPortadores(): void {
    const local = localStorage.getItem(this.LOCAL_KEY);
    if (local) {
      try {
        const data = JSON.parse(local);
        this.portadores = this.portadorPreparado(data);
        this.portadoresFiltrados = [...this.portadores];
        this.cdr.markForCheck();
        return;
      } catch (e) {
        console.error('Error leyendo Portadores de localStorage', e);
      }
    }

    this.cargando = true;
    this.error = '';
    this.portadoresService.obtenerPortadores().subscribe({
      next: (data: Portador[]) => {
        console.log('Portadores cargados:', data);
        this.portadores = this.portadorPreparado(data);
        this.portadoresFiltrados = [...this.portadores];
        this.cargando = false;
        this.cdr.markForCheck();
        localStorage.setItem(this.LOCAL_KEY, JSON.stringify(data));
      },
      error: (err) => {
        console.error('Error cargando portadores:', err);
        this.error = 'Error al cargar portadores: ' + err.message;
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  buscar(): void {
    console.log('Buscando:', this.campoBusqueda);

    const termino = this.campoBusqueda.toLowerCase().trim();

    if (!termino) {
      this.portadoresFiltrados = [...this.portadores];
      this.cdr.markForCheck();
      return;
    }

    if (this.portadores.length === 0) {
      console.log('No hay portadores para filtrar');
      return;
    }

    this.portadoresFiltrados = this.portadores.filter(portador =>
      (portador.personaje?.nombre ?? '').toLowerCase().includes(termino) ||
      (portador.anillo?.nombre ?? '').toLowerCase().includes(termino) ||
      portador.estado.toString().toLowerCase().includes(termino)
    );

    console.log(`Encontrados ${this.portadoresFiltrados.length} portadores`);
    this.cdr.markForCheck();
  }

  limpiar(): void {
    this.campoBusqueda = '';
    this.portadoresFiltrados = [...this.portadores];
    this.cdr.markForCheck();
  }

  // anillo = ''
  // portador = ''
  // nivel = 0
  // raza = ''

  // ngOnInit(): void {
  //   this.anillo = localStorage.getItem('anillo') ?? '';
  //   this.portador = localStorage.getItem('portador') ?? '';
  //   this.nivel = Number(localStorage.getItem('nivel')) ?? 0;
  //   this.raza = localStorage.getItem('raza') ?? '';
  // }

  // guardarPortadores() {
  //   localStorage.setItem('anillo', this.anillo);
  //   localStorage.setItem('portador', this.portador);
  //   localStorage.setItem('nivel', JSON.stringify(this.nivel));
  //   localStorage.setItem('raza', this.raza);

  //   alert('Datos guardados');
  // }
}
