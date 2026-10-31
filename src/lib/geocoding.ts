// Servicios de geocodificación y sitios cercanos con Nominatim (OpenStreetMap).
// No necesita API key. Nominatim pide máximo una petición por segundo,
// por eso las consultas de sitios cercanos van separadas por una pausa.
import axios from 'axios';
import { haversineMeters } from './geo';

export interface NearbyPlace {
  id: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distance: number;
}

interface NominatimPlace {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  class?: string;
  type?: string;
}

interface NominatimReverseResponse {
  display_name?: string;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const NEARBY_QUERIES = ['restaurante', 'cafe', 'farmacia', 'supermercado'];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  const { data } = await axios.get<NominatimReverseResponse>(`${NOMINATIM_URL}/reverse`, {
    params: {
      lat: latitude,
      lon: longitude,
      format: 'jsonv2',
      'accept-language': 'es',
    },
    timeout: 15000,
  });

  return data.display_name ?? '';
}

export async function findNearbyPlaces(
  latitude: number,
  longitude: number,
  radius = 500
): Promise<NearbyPlace[]> {
  const latDelta = radius / 111320;
  const lonDelta = latDelta / Math.cos((latitude * Math.PI) / 180);
  const viewbox = `${longitude - lonDelta},${latitude + latDelta},${longitude + lonDelta},${
    latitude - latDelta
  }`;

  const places: NearbyPlace[] = [];
  const seen = new Set<number>();
  let lastError: unknown = null;

  for (let index = 0; index < NEARBY_QUERIES.length; index += 1) {
    try {
      const { data } = await axios.get<NominatimPlace[]>(`${NOMINATIM_URL}/search`, {
        params: {
          q: NEARBY_QUERIES[index],
          format: 'jsonv2',
          limit: 8,
          viewbox,
          bounded: 1,
          'accept-language': 'es',
        },
        timeout: 15000,
      });

      for (const place of data) {
        if (seen.has(place.place_id)) continue;
        seen.add(place.place_id);

        const placeLat = Number(place.lat);
        const placeLon = Number(place.lon);
        if (!Number.isFinite(placeLat) || !Number.isFinite(placeLon)) continue;

        const distance = haversineMeters(
          { latitude, longitude },
          { latitude: placeLat, longitude: placeLon }
        );
        if (distance > radius) continue;

        places.push({
          id: place.place_id,
          name: place.name || place.display_name.split(',')[0] || 'Lugar sin nombre',
          type: place.type || place.class || 'lugar',
          latitude: placeLat,
          longitude: placeLon,
          distance,
        });
      }
    } catch (err) {
      lastError = err;
    }

    if (index < NEARBY_QUERIES.length - 1) {
      await delay(1100);
    }
  }

  if (places.length === 0 && lastError) throw lastError;

  return places.sort((a, b) => a.distance - b.distance).slice(0, 10);
}
