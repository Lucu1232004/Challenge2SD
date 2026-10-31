// Tipos del rastreo GPS del Challenge 09.

export interface TrackPoint {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface Track {
  id: string;
  name: string;
  startedAt: string;
  endedAt: string;
  distance: number;
  duration: number;
  points: TrackPoint[];
}
