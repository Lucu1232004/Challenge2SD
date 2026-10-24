// Hook de cámara: toma una foto o elige una de la galería.
import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export function useCamera() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const takePhoto = async (source: CameraSource = CameraSource.Camera) => {
    setLoading(true);
    setError('');
    try {
      const result = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
      });
      setPhoto(result.dataUrl || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo obtener la foto.');
    } finally {
      setLoading(false);
    }
  };

  const clearPhoto = () => setPhoto(null);

  return { photo, loading, error, takePhoto, clearPhoto };
}
