// Página de inicio de sesión: valida el correo y la contraseña contra Firebase.
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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password.trim());
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
          <IonTitle>Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="auth-container">
          <h2 className="auth-title">Mi Gestor de Tareas</h2>
          <p className="auth-subtitle">Ingresa con tu correo para ver tus tareas.</p>

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
              placeholder="Tu contraseña"
              onIonChange={(e) => setPassword(e.detail.value || '')}
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
            disabled={!email.trim() || !password.trim()}
          >
            Entrar
          </IonButton>

          <p className="auth-switch">
            ¿No tienes cuenta?{' '}
            <a onClick={() => navigate('/register')}>Regístrate aquí</a>
          </p>
        </div>

        <IonLoading isOpen={loading} message="Iniciando sesión..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;
