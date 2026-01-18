import { Component } from '@angular/core';
import { Anillos } from '../../clases/anillos';
import { Anillo } from '../../interfaces/anillo';
import { Razas } from '../../clases/razas';
import { Raza } from '../../interfaces/raza';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-busqueda',
  imports: [InputTextModule, FormsModule, ButtonModule, CommonModule],
  templateUrl: './busqueda.html',
  styleUrl: './busqueda.css',
})
export class Busqueda {

  anillo = new Anillos()
  raza = new Razas()

  anillosFiltrados: Anillo[] = this.anillo.anillos
  razasFiltradas: Raza[] = this.raza.razas

  campoBusqueda: string = '';

  buscar() {
    const t = this.campoBusqueda.toLowerCase();

    this.anillosFiltrados = this.anillo.anillos.filter(a =>
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
