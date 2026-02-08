export interface Personaje {
    id: number;
    nombre: string;
    raza: string;
    fechaNacimiento: string | Date;
    nivelCorrupcion: number;
    fechaBaja?: Date | string | null;
    estado: 'ACTIVO' | 'INACTIVO';
}
