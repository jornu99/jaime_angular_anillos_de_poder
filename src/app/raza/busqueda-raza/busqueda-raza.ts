import { Component } from '@angular/core';
import { Razas } from '../../clases/razas';
import { Raza } from '../../interfaces/raza';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-busqueda-raza',
  imports: [
    InputTextModule, 
    FormsModule, 
    ButtonModule, 
    CommonModule,
    TableModule,
    CardModule
  ],
  templateUrl: './busqueda-raza.html',
  styleUrl: './busqueda-raza.css',
})
export class BusquedaRaza {
  razas = new Razas();
  razasFiltradas: Raza[] = this.razas.razas;
  campoBusqueda: string = '';

  buscar() {
    const termino = this.campoBusqueda.toLowerCase().trim();
    
    if (!termino) {
      this.razasFiltradas = this.razas.razas;
      return;
    }

    this.razasFiltradas = this.razas.razas.filter(r =>
      r.nombre.toLowerCase().includes(termino) ||
      r.regionPrincipal.toLowerCase().includes(termino) ||
      r.longevidad.toLowerCase().includes(termino) ||
      r.descripcion.toLowerCase().includes(termino)
    );
  }

  limpiar() {
    this.campoBusqueda = '';
    this.razasFiltradas = this.razas.razas;
  }
}
