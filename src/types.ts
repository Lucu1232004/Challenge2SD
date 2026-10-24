// Tipos compartidos por la app de misiones.

export interface Mission {
  id: number;
  title: string;
  description: string;
  points: number;
}

export interface MissionState {
  id: number;
  completed: boolean;
}

export interface Progress {
  points: number;
  missions: MissionState[];
  maxDistance: number;
  photo?: string;
  updatedAt?: string;
}

export interface RankingEntry {
  id: string;
  name: string;
  email: string;
  points: number;
}
