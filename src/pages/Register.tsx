// PÃ¡gina de registro: crea una cuenta nueva con correo y contraseÃ±a en Supabase.
import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonLoading,
  IonNote,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthErrorMessage } from '../lib/errors';
import './Auth.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    if (password !== confirm) {
      setError('Las contraseÃ±as no coinciden.');
      return;
    }
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const result = await register(email.trim(), password.trim());
      if (result.needsConfirmation) {
        setNotice('Te enviamos un correo para confirmar la cuenta. DespuÃ©s de confirmarla, inicia sesiÃ³n.');
      } else {
        navigate('/tasks', { replace: true });
      }
    } catch (err) {
      console.error('Error al registrar la cuenta:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Crear cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="auth-container">
          <h2 className="auth-title">Mi Gestor de Tareas</h2>
          <p className="auth-subtitle">Crea tu cuenta para empezar a organizar tus tareas.</p>

          <IonItem>
            <IonLabel position="stacked">Correo electrÃ³nico</IonLabel>
            <IonInput
              type="email"
              value={email}
              placeholder="tucorreo@ejemplo.com"
              autocomplete="email"
              onIonInput={(e) => setEmail(e.detail.value || '')}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">ContraseÃ±a</IonLabel>
            <IonInput
              type="password"
              value={password}
              placeholder="MÃ­nimo 6 caracteres"
              autocomplete="new-password"
              onIonInput={(e) => setPassword(e.detail.value || '')}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Confirmar contraseÃ±a</IonLabel>
            <IonInput
              type="password"
              value={confirm}
              placeholder="Repite tu contraseÃ±a"
              autocomplete="new-password"
              onIonInput={(e) => setConfirm(e.detail.value || '')}
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p className="auth-error">{error}</p>
            </IonText>
          )}

          {notice && (
            <IonText color="success">
              <p className="auth-error">{notice}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            className="ion-margin-top"
            onClick={handleSubmit}
            disabled={!email.trim() || !password.trim() || !confirm.trim() || loading}
          >
            Crear cuenta
          </IonButton>

          {notice && (
            <IonButton expand="block" fill="outline" onClick={() => navigate('/login')}>
              Ir a iniciar sesiÃ³n
            </IonButton>
          )}

          <IonNote className="ion-margin-top auth-note">
            La contraseÃ±a la administra Supabase Auth. No se guarda en la app.
          </IonNote>

          <p className="auth-switch">
            Â¿Ya tienes cuenta?{' '}
            <a onClick={() => navigate('/login')}>Inicia sesiÃ³n aquÃ­</a>
          </p>
        </div>

        <IonLoading isOpen={loading} message="Creando tu cuenta..." />
      </IonContent>
    </IonPage>
  );
};

export default Register;
