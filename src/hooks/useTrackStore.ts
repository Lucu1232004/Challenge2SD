// Guarda y lee los rastreos en un archivo JSON dentro de Documents.
// El archivo se llama rastreos.json y contiene un arreglo de Track.
import { useCallback, useEffect, useState } from 'react';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import type { Track } from '../types/track';

const TRACKS_FILE = 'rastreos.json';

function isMissingFile(error: unknown): boolean {
  const message = (error as { message?: string })?.message?.toLowerCase() ?? '';
  return (
    message.includes('not found') ||
    message.includes('does not exist') ||
    message.includes('no such file') ||
    message.includes('notfound')
  );
}

export function useTrackStore() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const readTracks = async (): Promise<Track[]> => {
    try {
      const result = await Filesystem.readFile({
        path: TRACKS_FILE,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      const text = typeof result.data === 'string' ? result.data : await result.data.text();
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? (parsed as Track[]) : [];
    } catch (err) {
      if (isMissingFile(err)) return [];
      throw err;
    }
  };

  const persist = async (next: Track[]) => {
    await Filesystem.writeFile({
      path: TRACKS_FILE,
      data: JSON.stringify(next, null, 2),
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    setTracks(next);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTracks(await readTracks());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo leer el historial.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveTrack = async (track: Track) => {
    const current = await readTracks();
    const next = [track, ...current.filter((item) => item.id !== track.id)];
    await persist(next);
    return next;
  };

  const deleteTrack = async (id: string) => {
    const current = await readTracks();
    await persist(current.filter((track) => track.id !== id));
  };

  const clearAll = async () => {
    await persist([]);
  };

  return { tracks, loading, error, load, saveTrack, deleteTrack, clearAll };
}
