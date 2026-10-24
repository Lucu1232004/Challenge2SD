// Pantalla principal: un botón por cada sensor disponible.
import {
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonNote,
  IonPage,
  IonRow,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import {
  cameraOutline,
  chevronForwardOutline,
  cloudUploadOutline,
  folderOpenOutline,
  locationOutline,
  notificationsOutline,
  phonePortraitOutline,
  pulseOutline,
  speedometerOutline,
} from 'ionicons/icons';
import SensorHeader from '../components/SensorHeader';
import './Sensors.css';

const sensors = [
  {
    title: 'Geolocalización',
    description: 'Obtén tu posición y sigue tus movimientos.',
    icon: locationOutline,
    path: '/sensors/geolocation',
    color: 'primary',
  },
  {
    title: 'Cámara',
    description: 'Toma una foto o elige una de la galería.',
    icon: cameraOutline,
    path: '/sensors/camera',
    color: 'secondary',
  },
  {
    title: 'Movimiento',
    description: 'Acelerómetro y orientación del dispositivo.',
    icon: speedometerOutline,
    path: '/sensors/motion',
    color: 'tertiary',
  },
  {
    title: 'Dispositivo',
    description: 'Modelo, sistema operativo y batería.',
    icon: phonePortraitOutline,
    path: '/sensors/device',
    color: 'success',
  },
  {
    title: 'Hápticos',
    description: 'Vibraciones e impactos táctiles.',
    icon: pulseOutline,
    path: '/sensors/haptics',
    color: 'warning',
  },
  {
    title: 'Archivos',
    description: 'Guarda y lee un archivo de texto local.',
    icon: folderOpenOutline,
    path: '/sensors/filesystem',
    color: 'medium',
  },
  {
    title: 'Notificaciones locales',
    description: 'Programa recordatorios en el dispositivo.',
    icon: notificationsOutline,
    path: '/sensors/notifications',
    color: 'danger',
  },
  {
    title: 'Notificaciones push',
    description: 'Registra el dispositivo y recibe mensajes.',
    icon: cloudUploadOutline,
    path: '/sensors/push',
    color: 'dark',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <SensorHeader title="Sensores" back={false} />
      <IonContent className="ion-padding">
        <div className="home-hero">
          <h1>Challenge 07</h1>
          <p>Explora los sensores y funciones nativas del dispositivo.</p>
        </div>

        <IonGrid className="sensor-grid">
          <IonRow>
            {sensors.map((sensor) => (
              <IonCol size="12" sizeMd="6" key={sensor.path}>
                <IonCard button className="sensor-card" onClick={() => navigate(sensor.path)}>
                  <IonIcon icon={sensor.icon} color={sensor.color} className="sensor-card-icon" />
                  <div className="sensor-card-text">
                    <h2>{sensor.title}</h2>
                    <p>{sensor.description}</p>
                  </div>
                  <IonIcon icon={chevronForwardOutline} className="sensor-card-arrow" />
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonNote className="home-note">
          Algunos sensores solo funcionan en el teléfono. En el navegador pueden aparecer avisos de permiso o
          limitaciones.
        </IonNote>
      </IonContent>
    </IonPage>
  );
};

export default Home;
