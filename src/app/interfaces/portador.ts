export interface ResumenPersonaje {
    id: number;
    nombre: string;
}

export interface ResumenAnillo {
    id: number;
    nombre: string;
}

export interface Portador {
    id: number;
    personaje: ResumenPersonaje;
    anillo: ResumenAnillo;
    estado: boolean;
    fechaInicio: Date;
    fechaFin?: Date | null;
}