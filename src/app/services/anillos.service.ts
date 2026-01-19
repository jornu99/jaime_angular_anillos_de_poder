import { Injectable } from '@angular/core';
import { Anillos } from '../clases/anillos';
import { Anillo } from '../interfaces/anillo';

@Injectable({ providedIn: 'root' })
export class AnillosService {
  private readonly seed = new Anillos();

  // Referencia única (singleton) para compartir estado entre componentes
  readonly anillos: Anillo[] = this.seed.anillos;

  add(anillo: Anillo) {
    this.anillos.push(anillo);
  }
}
