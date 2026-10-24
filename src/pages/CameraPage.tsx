// Página de cámara: tomar una foto o elegir una de la galería.
import { IonButton, IonIcon, IonImg, IonNote, IonSpinner, IonText } from '@ionic/react';
import { cameraOutline, imagesOutline, trashOutline } from 'ionicons/icons';
import { CameraSource } from '@capacitor/camera';
import SensorPage from '../components/SensorPage';
import { useCamera } from '../hooks/useCamera';
import './Sensors.css';

const CameraPage: React.FC = () => {
  const { photo, loading, error, takePhoto, clearPhoto } = useCamera();

  return (
    <SensorPage title="Cámara">
      <p className="sensor-intro">
        Abre la cámara nativa para tomar una foto o elige una imagen que ya tengas en la galería.
      </p>

      <div className="sensor-actions">
        <IonButton onClick={() => takePhoto(CameraSource.Camera)} disabled={loading}>
          <IonIcon slot="start" icon={cameraOutline} />
          Tomar foto
        </IonButton>
        <IonButton fill="outline" onClick={() => takePhoto(CameraSource.Photos)} disabled={loading}>
          <IonIcon slot="start" icon={imagesOutline} />
          Elegir de galería
        </IonButton>
      </div>

      {loading && (
        <div className="sensor-loading">
          <IonSpinner name="crescent" />
          <span>Abriendo la cámara...</span>
        </div>
      )}

      {error && (
        <IonText color="danger">
          <p className="sensor-error">{error}</p>
        </IonText>
      )}

      {photo ? (
        <div className="photo-container">
          <IonImg src={photo} className="photo-preview" alt="Foto tomada desde la app" />
          <IonButton color="danger" fill="outline" onClick={clearPhoto}>
            <IonIcon slot="start" icon={trashOutline} />
            Borrar foto
          </IonButton>
        </div>
      ) : (
        <IonNote>No hay ninguna foto todavía.</IonNote>
      )}
    </SensorPage>
  );
};

export default CameraPage;
