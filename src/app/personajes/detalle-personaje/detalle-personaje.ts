import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PersonajesService } from '../../services/personajes.service';
import { Personaje } from '../../interfaces/personaje';

@Component({
  selector: 'app-detalle-personaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule],
  templateUrl: './detalle-personaje.html',
  styleUrl: './detalle-personaje.css'
})
export class DetallePersonaje implements OnInit {
  form!: FormGroup;
  personaje?: Personaje;
  esEditar = false;
  id?: number;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personajesService: PersonajesService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      raza: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      nivelCorrupcion: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.esEditar = !!this.id;
    if (this.id) {
      this.cargarPersonaje();
    }
  }

  cargarPersonaje() {
    console.log('🔍 Cargando ID:', this.id);
    this.cargando = true;
    this.personajesService.obtenerPersonaje(this.id!).subscribe({
      next: (personaje: any) => {
        console.log('📥 Datos recibidos:', personaje);
        this.personaje = personaje;
        this.form.reset();
        this.form.patchValue({
          nombre: personaje.nombre,
          raza: personaje.raza,
          fechaNacimiento: personaje.fechaNacimiento,
          nivelCorrupcion: personaje.nivelCorrupcion
        });
        setTimeout(() => {
          console.log('📋 Form actual:', this.form.value);
          this.cargando = false;
        }, 100);
        console.log('✅ Form loaded:', this.form.value);
      },
      error: (err) => {
        console.error('Error cargando personaje', err);
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (this.form.valid) {
      const datos = this.form.value;
      if (this.esEditar && this.id) {
        // Actualizar
        this.personajesService.actualizarPersonaje(this.id, datos).subscribe({
          next: () => this.router.navigate(['/personajes']),
          error: (err) => console.error('Error actualizando', err)
        });
      } else {
        // Crear nuevo
        this.personajesService.crearPersonaje(datos).subscribe({
          next: () => this.router.navigate(['/personajes']),
          error: (err) => console.error('Error creando', err)
        });
      }
    }
  }

  cancelar() {
    this.router.navigate(['/personajes']);
  }
}
