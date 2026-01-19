import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Anillo } from '../../interfaces/anillo';
import { CommonModule } from '@angular/common';
import { AnillosService } from '../../services/anillos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-anillo',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    SliderModule,
    CommonModule
  ],
  templateUrl: './registro-anillo.html',
  styleUrl: './registro-anillo.css',
})
export class RegistroAnillo {
  constructor(
    private readonly anillosService: AnillosService,
    private readonly router: Router
  ) {}
  
  opcionesRaza = [
    { label: 'Elfo', value: 'Elfo' },
    { label: 'Enano', value: 'Enano' },
    { label: 'Humano', value: 'Humano' },
    { label: 'Maiar', value: 'Maiar' },
    { label: 'Oscuro', value: 'Oscuro' }
  ];

  formulario: FormGroup = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    portador: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    raza: new FormControl('', [
      Validators.required
    ]),
    poder: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    corrupcion: new FormControl(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ])
  });

  enviar() {
    if (this.formulario.valid) {
      const nuevoAnillo: Anillo = {
        nombre: this.formulario.value.nombre,
        portador: this.formulario.value.portador,
        raza: this.formulario.value.raza,
        poder: this.formulario.value.poder,
        corrupcion: this.formulario.value.corrupcion
      };
      
      this.anillosService.add(nuevoAnillo);
      alert('Anillo registrado exitosamente');
      this.formulario.reset({ corrupcion: 0 });
      this.router.navigateByUrl('/buscar');
    } else {
      alert('Por favor, complete todos los campos correctamente');
    }
  }
}
