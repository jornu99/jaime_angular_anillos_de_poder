import { Routes } from '@angular/router';
import { Detalle } from './anillo/detalle/detalle';
import { Busqueda } from './anillo/busqueda/busqueda';
import { DetalleRaza } from './raza/detalle-raza/detalle-raza';
import { RegistroAnillo } from './anillo/registro-anillo/registro-anillo';
import { BusquedaRaza } from './raza/busqueda-raza/busqueda-raza';

export const routes: Routes = [
    { path: 'detalle', component: Detalle },
    { path: 'buscar', component: Busqueda },
    { path: 'detalleRaza', component: DetalleRaza },
    { path: 'registro-anillo', component: RegistroAnillo },
    { path: 'buscar-razas', component: BusquedaRaza }
];
