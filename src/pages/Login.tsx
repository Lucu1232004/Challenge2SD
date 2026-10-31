// PÃ¡gina de inicio de sesiÃ³n: valida el correo y la contraseÃ±a contra Supabase.
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
import { getAuthErrorMessage } from '../lib/errors';
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
      console.error('Error al iniciar sesión:', err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Iniciar sesiÃ³n</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="auth-container">
          <h2 className="auth-title">Mi Gestor de Tareas</h2>
          <p className="auth-subtitle">Ingresa con tu correo para ver tus tareas.</p>

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
              placeholder="Tu contraseÃ±a"
              autocomplete="current-password"
              onIonInput={(e) => setPassword(e.detail.value || '')}
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
            disabled={!email.trim() || !password.trim() || loading}
          >
            Entrar
          </IonButton>

          <p className="auth-switch">
            Â¿No tienes cuenta?{' '}
            <a onClick={() => navigate('/register')}>RegÃ­strate aquÃ­</a>
          </p>
        </div>

        <IonLoading isOpen={loading} message="Iniciando sesiÃ³n..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;
