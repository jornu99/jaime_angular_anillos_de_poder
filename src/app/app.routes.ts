import { Routes } from '@angular/router';
import { Detalle } from './anillo/detalle/detalle';
import { Busqueda } from './anillo/busqueda/busqueda';
import { DetalleRaza } from './raza/detalle-raza/detalle-raza';
import { RegistroAnillo } from './anillo/registro-anillo/registro-anillo';
import { BusquedaRaza } from './raza/busqueda-raza/busqueda-raza';
import { BuscarPersonaje } from './personajes/buscar-personaje/buscar-personaje';
import { DetallePersonaje } from './personajes/detalle-personaje/detalle-personaje';
import { Juego } from './juego/juego';
import { Portadores } from './portadores/portadores';

export const routes: Routes = [
    { path: 'buscar', component: Busqueda },
    { path: 'detalle', component: Detalle },
    { path: 'registro-anillo', component: RegistroAnillo },

    { path: 'buscar-razas', component: BusquedaRaza },
    { path: 'detalleRaza', component: DetalleRaza },

    { path: 'personajes', component: BuscarPersonaje },
    { path: 'personaje/editar/:id', component: DetallePersonaje },
    { path: 'insertarPersonaje', component: DetallePersonaje },

    { path: 'portadores', component: Portadores },

    { path: 'juego', component: Juego },

];
