import { Partida } from '../interfaces/partida';
import { Estadisticas } from '../interfaces/estadisticas';

const STATS_KEY = 'Estadísticas'

export class EstadisticasJuego {
    historial: Estadisticas[] = [];
    totales: {
        victorias: number,
        derrotas: number,
        totales: number
    } = {
            victorias: 0,
            derrotas: 0,
            totales: 0
        };

    constructor() {
        this.cargarEstadisticas();
    }

    private cargarEstadisticas(): void {
        try {
            const data = localStorage.getItem(STATS_KEY);
            if (!data) return;

            const parsed = JSON.parse(data);

            const v = parsed.totales?.victorias ?? 0;
            const d = parsed.totales?.derrotas ?? 0;
            this.totales = {
                victorias: v,
                derrotas: d,
                totales: v + d
            };

            if (parsed.historial && Array.isArray(parsed.historial)) {
                this.historial = parsed.historial.slice(0, 20);
            }
        } catch (error) {
            console.error('Error cargando stats:', error);
            localStorage.removeItem(STATS_KEY);
        }
    }

    private guardarEstadisticas(): void {
        try {
            this.totales.totales = this.totales.victorias + this.totales.derrotas;
            const data = {
                totales: { ...this.totales },
                historial: this.historial.slice(0, 20)
            };
            localStorage.setItem(STATS_KEY, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error guardando stats:', error);
        }
    }

    nuevaPartida(ganada: Boolean) {
        if (ganada) {
            this.totales.victorias++;
        } else {
            this.totales.derrotas++;
        }
        this.totales.totales = this.totales.victorias + this.totales.derrotas;

        const nuevaEstadistica: Estadisticas = {
            id: Date.now(),
            victorias: ganada ? 1 : 0,
            derrotas: ganada ? 0 : 1,
            totales: 1,
            fecha: new Date().toLocaleDateString('es-ES')
        };

        this.historial.unshift(nuevaEstadistica);
        this.historial = this.historial.slice(0, 20);

        this.guardarEstadisticas();
    }

    dePartidas(partidas: Partida[]): void {
        this.totales.victorias = partidas.filter(p => p.numeroCorrectas >= 5).length;
        this.totales.derrotas = partidas.length - this.totales.victorias;
        this.totales.totales = partidas.length;

        this.historial = partidas.map((p) => ({
            id: p.id,
            victorias: p.numeroCorrectas >= 5 ? 1 : 0,
            derrotas: p.numeroCorrectas < 5 ? 1 : 0,
            totales: 1,
            fecha: p.fechaInicio
        })).slice(0, 20);

        this.guardarEstadisticas();
    }

    reset(): void {
        this.totales = { victorias: 0, derrotas: 0, totales: 0 };
        this.historial = [];
        localStorage.removeItem(STATS_KEY);
    }
}