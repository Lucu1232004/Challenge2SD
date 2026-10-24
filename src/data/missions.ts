// Definición de las tres misiones del parcial y sus puntos.
import { Mission } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'Evidencia fotográfica',
    description: 'Toma una foto y guárdala como evidencia para completar la misión.',
    points: 30,
  },
  {
    id: 2,
    title: 'Movimiento real',
    description: 'Muévete al menos 30 metros de tu posición inicial.',
    points: 40,
  },
  {
    id: 3,
    title: 'Permanencia activa',
    description: 'Después de recorrer 50 metros, quédate quieto 10 segundos para vibrar.',
    points: 50,
  },
];

export const TOTAL_POINTS = MISSIONS.reduce((sum, mission) => sum + mission.points, 0);

export function getMission(id: number) {
  return MISSIONS.find((mission) => mission.id === id);
}

export function getMissionPoints(id: number) {
  return getMission(id)?.points ?? 0;
}
