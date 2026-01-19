import { Component } from '@angular/core';
import { Anillo } from '../../interfaces/anillo';
import { Razas } from '../../clases/razas';
import { Raza } from '../../interfaces/raza';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnillosService } from '../../services/anillos.service';



@Component({
  selector: 'app-busqueda',
  imports: [InputTextModule, FormsModule, ButtonModule, CommonModule, RouterLink],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda {

  constructor(private readonly anillosService: AnillosService) {
    this.anillosFiltrados = this.anillosService.anillos;
  }
  raza = new Razas()

  anillosFiltrados: Anillo[] = []
  razasFiltradas: Raza[] = this.raza.razas

  campoBusqueda: string = '';

  buscar() {
    const t = this.campoBusqueda.toLowerCase();

    this.anillosFiltrados = this.anillosService.anillos.filter(a =>
      a.nombre.toLowerCase().includes(t) ||
      a.portador.toLowerCase().includes(t) ||
      a.raza.toLowerCase().includes(t)
    );

    this.razasFiltradas = this.raza.razas.filter(r =>
      r.nombre.toLowerCase().includes(t) ||
      r.regionPrincipal.toLowerCase().includes(t) ||
      r.longevidad.toLowerCase().includes(t) ||
      r.descripcion.toLowerCase().includes(t)
    );
  }
}
