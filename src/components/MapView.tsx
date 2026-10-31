// Mapa reutilizable con Leaflet: marcador, precisión y recorrido.
import { useEffect } from 'react';
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Coordinate } from '../lib/geo';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  center: Coordinate;
  points?: Coordinate[];
  accuracy?: number | null;
  follow?: boolean;
  height?: number;
}

// Mantiene el mapa centrado cuando cambia la posición y ajusta el tamaño
// después de que Ionic termina la transición de la página.
const Recenter: React.FC<{ center: Coordinate; follow: boolean }> = ({ center, follow }) => {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 200);
    if (follow) {
      map.setView([center.latitude, center.longitude], map.getZoom());
    }
    return () => window.clearTimeout(timer);
  }, [center.latitude, center.longitude, follow, map]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({
  center,
  points = [],
  accuracy,
  follow = true,
  height = 340,
}) => {
  const path = points.map((point) => [point.latitude, point.longitude] as [number, number]);

  return (
    <div className="map-wrapper" style={{ height }}>
      <MapContainer
        center={[center.latitude, center.longitude]}
        zoom={16}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} follow={follow} />
        {accuracy ? (
          <Circle
            center={[center.latitude, center.longitude]}
            radius={accuracy}
            pathOptions={{ color: '#3880ff', fillColor: '#3880ff', fillOpacity: 0.12 }}
          />
        ) : null}
        {path.length > 1 && (
          <Polyline positions={path} pathOptions={{ color: '#2dd36f', weight: 5 }} />
        )}
        <Marker position={[center.latitude, center.longitude]}>
          <Popup>Estás aquí</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
