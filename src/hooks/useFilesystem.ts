// Hook del sistema de archivos: guardar, leer y borrar un archivo de texto.
import { useState } from 'react';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

const FILE_NAME = 'sensores.txt';

export function useFilesystem() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const save = async (text: string) => {
    setError('');
    setStatus('');
    try {
      await Filesystem.writeFile({
        path: FILE_NAME,
        data: text,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      setStatus(`Archivo guardado en Documents/${FILE_NAME}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el archivo.');
    }
  };

  const read = async (): Promise<string | null> => {
    setError('');
    setStatus('');
    try {
      const result = await Filesystem.readFile({
        path: FILE_NAME,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      const text = typeof result.data === 'string' ? result.data : await result.data.text();
      setStatus(`Archivo leído desde Documents/${FILE_NAME}.`);
      return text;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo leer el archivo.');
      return null;
    }
  };

  const remove = async () => {
    setError('');
    setStatus('');
    try {
      await Filesystem.deleteFile({
        path: FILE_NAME,
        directory: Directory.Documents,
      });
      setStatus(`Archivo Documents/${FILE_NAME} eliminado.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el archivo.');
    }
  };

  return { status, error, save, read, remove, fileName: FILE_NAME };
}
