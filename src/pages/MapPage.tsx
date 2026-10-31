// Página principal del Challenge 09: mapa, rastreo GPS, sitios cercanos
// y avisos de red, batería y movimiento.
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IonBadge,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonText,
  IonToggle,
} from '@ionic/react';
import {
  locateOutline,
  navigateOutline,
  playOutline,
  stopOutline,
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import { Device } from '@capacitor/device';
import { Haptics } from '@capacitor/haptics';
import SensorPage from '../components/SensorPage';
import MapView from '../components/MapView';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTrackStore } from '../hooks/useTrackStore';
import { useNetwork } from '../hooks/useNetwork';
import { useDevice } from '../hooks/useDevice';
import { useAccelerometer } from '../hooks/useAccelerometer';
import { buildTrackName, formatDistance, formatDuration, haversineMeters } from '../lib/geo';
import type { Coordinate } from '../lib/geo';
import { findNearbyPlaces, reverseGeocode } from '../lib/geocoding';
import type { NearbyPlace } from '../lib/geocoding';
import { notify } from '../lib/notifications';
import type { Track, TrackPoint } from '../types/track';
import './Maps.css';

const DEFAULT_CENTER: Coordinate = { latitude: 3.4516, longitude: -76.532 };

const MapPage: React.FC = () => {
  const location = useLocation();
  const incomingTrack = (location.state as { track?: Track } | null)?.track;

  const {
    position,
    loading: geoLoading,
    error: geoError,
    getCurrentPosition,
    startWatch,
    stopWatch,
  } = useGeolocation();
  const { connected } = useNetwork();
  const { data: device } = useDevice();
  const { accel, start: startMotion, stop: stopMotion } = useAccelerometer();
  const { saveTrack } = useTrackStore();

  const [tracking, setTracking] = useState(false);
  const [points, setPoints] = useState<TrackPoint[]>(incomingTrack?.points ?? []);
  const [startedAt, setStartedAt] = useState<number | null>(
    incomingTrack ? new Date(incomingTrack.startedAt).getTime() : null
  );
  const [endedAt, setEndedAt] = useState<number | null>(
    incomingTrack ? new Date(incomingTrack.endedAt).getTime() : null
  );
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(
    incomingTrack?.id ?? null
  );
  const [address, setAddress] = useState('');
  const [nearby, setNearby] = useState<NearbyPlace[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [message, setMessage] = useState(
    incomingTrack ? `Mostrando ${incomingTrack.name}.` : ''
  );
  const [actionError, setActionError] = useState('');
  const [autoStart, setAutoStart] = useState(false);
  const [follow, setFollow] = useState(true);
  const [now, setNow] = useState(Date.now());

  const trackingRef = useRef(false);
  const lastNoticeRef = useRef(0);
  const stopTrackingRef = useRef<(reason?: string) => Promise<void>>(async () => {});
  const previousConnectedRef = useRef(connected);

  const latitude = position?.coords.latitude ?? null;
  const longitude = position?.coords.longitude ?? null;
  const currentPoint: Coordinate | null =
    latitude !== null && longitude !== null ? { latitude, longitude } : null;

  const center: Coordinate =
    currentPoint ??
    (points.length > 0
      ? { latitude: points[points.length - 1].latitude, longitude: points[points.length - 1].longitude }
      : DEFAULT_CENTER);

  const distance = useMemo(() => {
    let total = 0;
    for (let index = 1; index < points.length; index += 1) {
      total += haversineMeters(points[index - 1], points[index]);
    }
    return total;
  }, [points]);

  const duration = startedAt
    ? Math.max(0, Math.round(((tracking ? now : endedAt ?? now) - startedAt) / 1000))
    : 0;

  const acceleration = accel ? Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2) : 9.8;
  const moving = Math.abs(acceleration - 9.8) > 1.5;
  const batteryPercent =
    device?.batteryLevel !== null && device?.batteryLevel !== undefined
      ? Math.round(device.batteryLevel * 100)
      : null;

  const startTracking = async () => {
    if (trackingRef.current) return;
    setActionError('');
    setMessage('');

    try {
      const battery = await Device.getBatteryInfo();
      if (
        battery.batteryLevel !== undefined &&
        battery.batteryLevel !== null &&
        battery.batteryLevel < 0.2 &&
        !battery.isCharging
      ) {
        setActionError('La batería está por debajo del 20%. Conecta el cargador para iniciar el rastreo.');
        return;
      }
    } catch {
      // En web la batería puede no estar disponible, seguimos.
    }

    const id = `track-${Date.now()}`;
    const start = Date.now();
    setCurrentTrackId(id);
    setStartedAt(start);
    setEndedAt(null);
    setPoints([]);
    setTracking(true);
    trackingRef.current = true;
    lastNoticeRef.current = start;

    await startWatch();

    try {
      await Haptics.vibrate({ duration: 300 });
    } catch {
      // La vibración no está disponible en todos los navegadores.
    }

    await notify('Rastreo iniciado', 'La app está guardando tu recorrido.');
    setMessage('Rastreo iniciado. Camina un poco para dibujar el recorrido.');
  };

  const stopTracking = async (reason = 'manual') => {
    if (!trackingRef.current) return;

    const end = Date.now();
    const track: Track = {
      id: currentTrackId ?? `track-${end}`,
      name: buildTrackName(startedAt ?? end),
      startedAt: new Date(startedAt ?? end).toISOString(),
      endedAt: new Date(end).toISOString(),
      distance,
      duration: startedAt ? Math.round((end - startedAt) / 1000) : 0,
      points,
    };

    await stopWatch();
    setTracking(false);
    trackingRef.current = false;
    setEndedAt(end);

    if (track.points.length > 0) {
      try {
        await saveTrack(track);
        setMessage(
          `Rastreo guardado: ${formatDistance(track.distance)} en ${formatDuration(track.duration)}.`
        );
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'No se pudo guardar el rastreo.');
      }
    } else {
      setMessage('No se registraron puntos. El rastreo no se guardó.');
    }

    await notify(
      'Rastreo finalizado',
      reason === 'battery' ? 'Se detuvo por batería baja.' : `Se guardaron ${track.points.length} puntos.`
    );
  };

  stopTrackingRef.current = stopTracking;

  const handleNearby = async () => {
    if (!currentPoint) return;
    setNearbyLoading(true);
    setActionError('');
    try {
      const places = await findNearbyPlaces(currentPoint.latitude, currentPoint.longitude);
      setNearby(places);
      if (places.length === 0) {
        setMessage('No se encontraron sitios cercanos en 500 metros.');
      }
    } catch {
      setActionError('No se pudieron cargar los sitios cercanos. Revisa la conexión.');
    } finally {
      setNearbyLoading(false);
    }
  };

  const handleLocation = async () => {
    setActionError('');
    await getCurrentPosition();
  };

  // Arranca el acelerómetro una sola vez para detectar movimiento.
  useEffect(() => {
    void startMotion();
    return () => {
      void stopMotion();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Agrega un punto nuevo cuando el GPS reporta una posición y hay rastreo.
  useEffect(() => {
    if (!tracking || latitude === null || longitude === null) return;

    const point: TrackPoint = {
      latitude,
      longitude,
      accuracy: position?.coords.accuracy ?? 0,
      timestamp: position?.timestamp ?? Date.now(),
    };

    setPoints((previous) => {
      const last = previous[previous.length - 1];
      if (last && haversineMeters(last, point) < 3) return previous;
      return [...previous, point];
    });
  }, [tracking, latitude, longitude, position?.coords.accuracy, position?.timestamp]);

  // Actualiza la duración cada segundo mientras el rastreo está activo.
  useEffect(() => {
    if (!tracking) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [tracking]);

  // Dirección aproximada de la posición actual.
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

  // Inicio automático cuando el acelerómetro detecta movimiento.
  useEffect(() => {
    if (autoStart && moving && !trackingRef.current) {
      void startTracking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, moving]);

  // Batería baja y recordatorio de inmovilidad mientras se rastrea.
  useEffect(() => {
    if (!tracking) return;

    const timer = window.setInterval(async () => {
      try {
        const battery = await Device.getBatteryInfo();
        if (
          battery.batteryLevel !== undefined &&
          battery.batteryLevel !== null &&
          battery.batteryLevel < 0.2 &&
          !battery.isCharging
        ) {
          await notify('Batería baja', 'El rastreo se detuvo para ahorrar batería.');
          await stopTrackingRef.current('battery');
          return;
        }
      } catch {
        // Sin información de batería en web.
      }

      if (moving) {
        lastNoticeRef.current = Date.now();
      } else if (Date.now() - lastNoticeRef.current > 120000) {
        lastNoticeRef.current = Date.now();
        await notify('Sin movimiento', 'Llevas un rato en el mismo lugar.');
      }
    }, 60000);

    return () => window.clearInterval(timer);
  }, [tracking, moving]);

  // Avisa cuando se pierde o vuelve la conexión durante un rastreo.
  useEffect(() => {
    if (previousConnectedRef.current === connected) return;
    if (tracking) {
      void notify(
        connected ? 'Conexión restaurada' : 'Sin conexión',
        connected
          ? 'La app volvió a estar en línea.'
          : 'El rastreo sigue guardando puntos en el dispositivo.'
      );
    }
    previousConnectedRef.current = connected;
  }, [connected, tracking]);

  return (
    <SensorPage title="Mapa y rastreo">
      <p className="sensor-intro">
        Mueve el mapa, inicia un rastreo y guarda el recorrido como JSON. También puedes consultar
        sitios cercanos con OpenStreetMap.
      </p>

      <div className="map-status-row">
        <IonBadge color={connected ? 'success' : 'danger'}>
          {connected ? 'Con red' : 'Sin red'}
        </IonBadge>
        <IonBadge color={tracking ? 'success' : 'medium'}>
          {tracking ? 'Rastreando' : 'Detenido'}
        </IonBadge>
        <IonBadge color={moving ? 'warning' : 'medium'}>
          {moving ? 'En movimiento' : 'Quieto'}
        </IonBadge>
        {batteryPercent !== null && (
          <IonBadge color={batteryPercent < 20 ? 'danger' : 'medium'}>
            Batería {batteryPercent}%
          </IonBadge>
        )}
      </div>

      <MapView
        center={center}
        points={points}
        accuracy={position?.coords.accuracy ?? null}
        follow={follow}
      />

      <div className="sensor-actions">
        {tracking ? (
          <IonButton color="danger" onClick={() => void stopTracking('manual')}>
            <IonIcon slot="start" icon={stopOutline} />
            Detener y guardar
          </IonButton>
        ) : (
          <IonButton onClick={() => void startTracking()} disabled={geoLoading}>
            <IonIcon slot="start" icon={playOutline} />
            Iniciar rastreo
          </IonButton>
        )}

        <IonButton fill="outline" onClick={() => void handleLocation()} disabled={geoLoading}>
          {geoLoading ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={locateOutline} />
              Mi ubicación
            </>
          )}
        </IonButton>

        <IonButton
          fill="outline"
          onClick={() => void handleNearby()}
          disabled={!currentPoint || nearbyLoading || !connected}
        >
          {nearbyLoading ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={navigateOutline} />
              Sitios cercanos
            </>
          )}
        </IonButton>
      </div>

      <IonList inset>
        <IonItem lines="none">
          <IonToggle checked={autoStart} onIonChange={(event) => setAutoStart(event.detail.checked)}>
            Iniciar al detectar movimiento
          </IonToggle>
        </IonItem>
        <IonItem lines="none">
          <IonToggle checked={follow} onIonChange={(event) => setFollow(event.detail.checked)}>
            Seguir mi posición
          </IonToggle>
        </IonItem>
      </IonList>

      <div className="sensor-panel">
        <h3>Rastreo actual</h3>
        <div className="sensor-row">
          <span>Puntos</span>
          <strong>{points.length}</strong>
        </div>
        <div className="sensor-row">
          <span>Distancia</span>
          <strong>{formatDistance(distance)}</strong>
        </div>
        <div className="sensor-row">
          <span>Duración</span>
          <strong>{formatDuration(duration)}</strong>
        </div>
        <div className="sensor-row">
          <span>Dirección</span>
          <strong>{address || (connected ? 'Buscando...' : 'Sin conexión')}</strong>
        </div>
        {currentPoint && (
          <div className="sensor-row">
            <span>Coordenadas</span>
            <strong>
              {currentPoint.latitude.toFixed(6)}, {currentPoint.longitude.toFixed(6)}
            </strong>
          </div>
        )}
      </div>

      {nearby.length > 0 && (
        <div className="sensor-panel">
          <h3>Sitios cercanos</h3>
          <IonList lines="none">
            {nearby.map((place) => (
              <IonItem key={place.id}>
                <IonLabel>
                  <h4>{place.name}</h4>
                  <p>
                    {place.type} · {formatDistance(place.distance)}
                  </p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      )}

      {(geoError || actionError) && (
        <IonText color="danger">
          <p className="sensor-error">{geoError || actionError}</p>
        </IonText>
      )}

      {message && <IonNote className="sensor-note">{message}</IonNote>}
    </SensorPage>
  );
};

export default MapPage;
