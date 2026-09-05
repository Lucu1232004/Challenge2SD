import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { logInOutline, mailOutline, lockClosedOutline, personAddOutline } from 'ionicons/icons';
import { login } from '../data/auth';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setShowError(true);
      return;
    }

    const success = login(email, password);

    if (success) {
      navigate('/home', { replace: true });
    } else {
      setShowError(true);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger">
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding login-content">
        <div className="login-container">
          <div className="login-icon">
            <IonIcon icon={logInOutline} color="danger" />
          </div>

          <h2 className="login-title">¡Bienvenido de nuevo!</h2>
          <p className="login-subtitle">Ingresa tus datos para entrar a tu agenda</p>

          <IonList className="login-form">
            <IonItem>
              <IonLabel position="stacked">Correo electrónico</IonLabel>
              <IonInput
                type="email"
                value={email}
                placeholder="ejemplo@correo.com"
                onIonChange={(e) => setEmail(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={password}
                placeholder="Escribe tu contraseña"
                onIonChange={(e) => setPassword(e.detail.value || '')}
              />
            </IonItem>
          </IonList>

          <IonButton
            expand="block"
            color="danger"
            className="ion-margin-top login-button"
            onClick={handleLogin}
          >
            <IonIcon slot="start" icon={logInOutline} />
            Iniciar Sesión
          </IonButton>

          <div className="login-footer">
            <IonText color="medium">
              <p>
                ¿No tienes cuenta?{' '}
                <IonButton fill="clear" color="danger" onClick={goToRegister} className="link-button">
                  ¡Regístrate aquí!
                </IonButton>
              </p>
            </IonText>
          </div>
        </div>

        <IonAlert
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          header="Ups, algo salió mal"
          message="El correo o la contraseña no coinciden. Si aún no tienes cuenta, puedes registrarte gratis."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
