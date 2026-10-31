// Toma una foto con la cámara y le dibuja la dirección y las coordenadas
// como marca de agua. Luego se puede guardar en Documents.
import { useEffect, useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonNote,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { cameraOutline, locateOutline, saveOutline } from 'ionicons/icons';
import { CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import SensorPage from '../components/SensorPage';
import { useCamera } from '../hooks/useCamera';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNetwork } from '../hooks/useNetwork';
import { reverseGeocode } from '../lib/geocoding';
import { notify } from '../lib/notifications';
import './Maps.css';

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (context.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function addWatermark(
  source: string,
  address: string,
  latitude: number | null,
  longitude: number | null
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 1080;
      const scale = Math.min(1, maxWidth / image.width);
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('No se pudo crear el lienzo de la foto.'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const padding = 18;
      const lineHeight = 22;
      context.font = '16px sans-serif';
      const addressLines = wrapText(
        context,
        address || 'Ubicación sin dirección',
        canvas.width - padding * 2
      ).slice(0, 3);
      const coordinates =
        latitude !== null && longitude !== null
          ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          : 'Sin coordenadas';
      const lines = [...addressLines, coordinates, new Date().toLocaleString('es-CO')];
      const boxHeight = lines.length * lineHeight + padding * 2;

      context.fillStyle = 'rgba(0, 0, 0, 0.65)';
      context.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);
      context.fillStyle = '#ffffff';
      context.font = '16px sans-serif';

      lines.forEach((line, index) => {
        context.fillText(
          line,
          padding,
          canvas.height - boxHeight + padding + (index + 1) * lineHeight - 6
        );
      });

      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    image.onerror = () => reject(new Error('No se pudo cargar la foto.'));
    image.src = source;
  });
}

const LocationPhotoPage: React.FC = () => {
  const { photo, loading: cameraLoading, error: cameraError, takePhoto } = useCamera();
  const {
    position,
    loading: geoLoading,
    error: geoError,
    getCurrentPosition,
  } = useGeolocation();
  const { connected } = useNetwork();

  const [address, setAddress] = useState('');
  const [watermarked, setWatermarked] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [saving, setSaving] = useState(false);

  const latitude = position?.coords.latitude ?? null;
  const longitude = position?.coords.longitude ?? null;

  useEffect(() => {
    void getCurrentPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (latitude === null || longitude === null || !connected) return;

    let active = true;
    void reverseGeocode(latitude, longitude)
      .then((text) => {
        if (active && text) setAddress(text);
      })
      .catch(() => {
        if (active) setAddress('');
      });

    return () => {
      active = false;
    };
  }, [latitude, longitude, connected]);

  useEffect(() => {
    if (!photo) {
      setWatermarked(null);
      return;
    }

    let active = true;
    void addWatermark(photo, address, latitude, longitude)
      .then((uri) => {
        if (active) setWatermarked(uri);
      })
      .catch((err) => {
        if (active) setActionError(err instanceof Error ? err.message : 'No se pudo procesar la foto.');
      });

    return () => {
      active = false;
    };
  }, [photo, address, latitude, longitude]);

  const handleTake = async () => {
    setMessage('');
    setActionError('');
    // En web no hay cámara nativa: se elige una imagen del equipo.
    // En Android/iOS se ofrece cámara o galería.
    const source = Capacitor.getPlatform() === 'web' ? CameraSource.Photos : CameraSource.Prompt;
    await takePhoto(source);
  };

  const handleSave = async () => {
    if (!watermarked) return;

    setSaving(true);
    setMessage('');
    setActionError('');

    try {
      const base64 = watermarked.split(',')[1];
      const fileName = `foto-ubicacion-${Date.now()}.jpeg`;
      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });
      setMessage(`Foto guardada en Documents/${fileName}.`);
      await notify('Foto guardada', 'La foto con ubicación quedó en Documents.');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo guardar la foto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SensorPage title="Foto con ubicación">
      <p className="sensor-intro">
        Toma una foto y la app le escribe la dirección, las coordenadas y la fecha como marca de
        agua. Después puedes guardarla en Documents.
      </p>

      <div className="sensor-actions">
        <IonButton onClick={() => void handleTake()} disabled={cameraLoading}>
          {cameraLoading ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={cameraOutline} />
              Tomar foto
            </>
          )}
        </IonButton>

        <IonButton fill="outline" onClick={() => void getCurrentPosition()} disabled={geoLoading}>
          {geoLoading ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={locateOutline} />
              Actualizar ubicación
            </>
          )}
        </IonButton>

        <IonButton fill="outline" onClick={() => void handleSave()} disabled={!watermarked || saving}>
          {saving ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={saveOutline} />
              Guardar foto
            </>
          )}
        </IonButton>
      </div>

      <div className="sensor-panel">
        <div className="sensor-row">
          <span>Dirección</span>
          <strong>{address || (connected ? 'Buscando...' : 'Sin conexión')}</strong>
        </div>
        <div className="sensor-row">
          <span>Coordenadas</span>
          <strong>
            {latitude !== null && longitude !== null
              ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              : 'Sin GPS'}
          </strong>
        </div>
        <div className="sensor-row">
          <span>Red</span>
          <strong>{connected ? 'Conectado' : 'Sin conexión'}</strong>
        </div>
      </div>

      {watermarked ? (
        <div className="photo-container">
          <img className="photo-preview" src={watermarked} alt="Foto con ubicación" />
        </div>
      ) : (
        <IonNote className="sensor-note">
          Todavía no hay foto. Pulsa "Tomar foto" para empezar.
        </IonNote>
      )}

      {(cameraError || geoError || actionError) && (
        <IonText color="danger">
          <p className="sensor-error">{cameraError || geoError || actionError}</p>
        </IonText>
      )}

      {message && <IonNote className="sensor-note">{message}</IonNote>}

      <IonNote className="sensor-note">
        En Android la foto queda en Documents. En el navegador se guarda en el almacenamiento local.
      </IonNote>
    </SensorPage>
  );
};

export default LocationPhotoPage;
