// Página de perfil: muestra el correo, permite cambiar la foto
// y cerrar la sesión de Supabase.
import { useRef, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonImg,
  IonButton,
  IonIcon,
  IonText,
  IonLoading,
  IonNote,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { cameraOutline, imageOutline, logOutOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { captureAvatar, isCameraCancel } from '../lib/camera';
import { getAuthErrorMessage, getDataErrorMessage } from '../lib/errors';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, profile, updateAvatar, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const email = profile?.email || user?.email || 'Sin correo';
  const initials = email.slice(0, 2).toUpperCase();

  const uploadFile = async (file: Blob) => {
    setError('');
    setUploading(true);
    try {
      await updateAvatar(file);
    } catch (err) {
      setError(getDataErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleCapture = async () => {
    setError('');
    try {
      const photo = await captureAvatar();
      if (photo) await uploadFile(photo);
    } catch (err) {
      if (!isCameraCancel(err)) {
        setError('No se pudo abrir la cámara. En el navegador puedes elegir un archivo.');
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) await uploadFile(file);
  };

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>Mi perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="profile-container">
          <IonAvatar className="profile-avatar">
            {profile?.avatar_url ? (
              <IonImg src={profile.avatar_url} alt="Foto de perfil" />
            ) : (
              <span>{initials}</span>
            )}
          </IonAvatar>

          <h2 className="profile-email">{email}</h2>

          <IonList inset className="profile-data">
            <IonItem>
              <IonLabel>Backend</IonLabel>
              <IonNote slot="end">Supabase</IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>Almacenamiento</IonLabel>
              <IonNote slot="end">Bucket avatars</IonNote>
            </IonItem>
          </IonList>

          {error && (
            <IonText color="danger">
              <p className="profile-error">{error}</p>
            </IonText>
          )}

          <div className="profile-actions">
            <IonButton expand="block" onClick={handleCapture} disabled={uploading}>
              <IonIcon slot="start" icon={cameraOutline} />
              Tomar o elegir foto
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <IonIcon slot="start" icon={imageOutline} />
              Elegir desde archivo
            </IonButton>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="profile-file-input"
              onChange={handleFileChange}
            />

            <IonButton expand="block" color="danger" fill="outline" onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} />
              Cerrar sesión
            </IonButton>
          </div>

          <IonNote className="profile-note">
            La foto se guarda en el bucket avatars y la URL queda asociada a tu perfil.
          </IonNote>
        </div>

        <IonLoading isOpen={uploading} message="Subiendo la foto..." />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
