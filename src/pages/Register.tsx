// Página de registro: crea una cuenta nueva con correo y contraseña en Firebase.
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
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../firebase/errors';
import './Auth.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(email.trim(), password.trim());
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
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
            <IonLabel position="stacked">Correo electrónico</IonLabel>
            <IonInput
              type="email"
              value={email}
              placeholder="tucorreo@ejemplo.com"
              onIonChange={(e) => setEmail(e.detail.value || '')}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput
              type="password"
              value={password}
              placeholder="Mínimo 6 caracteres"
              onIonChange={(e) => setPassword(e.detail.value || '')}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Confirmar contraseña</IonLabel>
            <IonInput
              type="password"
              value={confirm}
              placeholder="Repite tu contraseña"
              onIonChange={(e) => setConfirm(e.detail.value || '')}
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p className="auth-error">{error}</p>
            </IonText>
          )}

          <IonButton
            expand="block"
            className="ion-margin-top"
            onClick={handleSubmit}
            disabled={!email.trim() || !password.trim() || !confirm.trim()}
          >
            Crear cuenta
          </IonButton>

          <p className="auth-switch">
            ¿Ya tienes cuenta?{' '}
            <a onClick={() => navigate('/login')}>Inicia sesión aquí</a>
          </p>
        </div>

        <IonLoading isOpen={loading} message="Creando tu cuenta..." />
      </IonContent>
    </IonPage>
  );
};

export default Register;
