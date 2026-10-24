// Misión 1: tomar una foto y guardarla como evidencia.
import { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonImg, IonNote, IonSpinner, IonText } from '@ionic/react';
import { cameraOutline, checkmarkCircleOutline, saveOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import MissionPage from '../components/MissionPage';
import { useProgress } from '../hooks/useProgress';
import './Missions.css';

const PhotoMissionPage: React.FC = () => {
  const { progress, completeMission, savePhoto } = useProgress();
  const [photo, setPhoto] = useState<string | null>(progress?.photo || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const missionState = progress?.missions.find((mission) => mission.id === 1);
  const completed = Boolean(missionState?.completed) || saved;

  useEffect(() => {
    if (progress?.photo && !photo) {
      setPhoto(progress.photo);
    }
  }, [progress?.photo, photo]);

  const takePhoto = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      setPhoto(result.dataUrl || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo abrir la cámara.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!photo) return;
    setSaving(true);
    setError('');
    try {
      savePhoto(photo);
      await completeMission(1);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la evidencia.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MissionPage title="Evidencia fotográfica">
      <p className="mission-intro">
        Toma una foto con la cámara del dispositivo. La misión se completa cuando guardas la imagen
        como evidencia.
      </p>

      {completed && (
        <div className="mission-success">
          <IonIcon icon={checkmarkCircleOutline} />
          <span>Misión completada. Ganaste 30 puntos.</span>
        </div>
      )}

      <div className="mission-actions">
        <IonButton onClick={takePhoto} disabled={loading}>
          {loading ? (
            <IonSpinner name="dots" />
          ) : (
            <>
              <IonIcon slot="start" icon={cameraOutline} />
              {photo ? 'Tomar otra foto' : 'Tomar foto'}
            </>
          )}
        </IonButton>
        <IonButton
          fill="outline"
          onClick={handleSave}
          disabled={!photo || saving || completed}
        >
          <IonIcon slot="start" icon={saveOutline} />
          {saving ? 'Guardando...' : 'Guardar evidencia'}
        </IonButton>
      </div>

      {error && (
        <IonText color="danger">
          <p className="mission-error">{error}</p>
        </IonText>
      )}

      {photo ? (
        <div className="photo-container">
          <IonImg src={photo} className="photo-preview" alt="Evidencia de la misión" />
        </div>
      ) : (
        <IonNote>No hay ninguna foto todavía.</IonNote>
      )}

      <IonNote className="mission-note">
        La foto se guarda localmente en el dispositivo. El progreso y los puntos se envían a Firebase.
      </IonNote>
    </MissionPage>
  );
};

export default PhotoMissionPage;
