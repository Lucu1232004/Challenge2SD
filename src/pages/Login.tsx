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
          <IonTitle>Iniciar Sesion</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding login-content">
        <div className="login-container">
          <div className="login-icon">
            <IonIcon icon={logInOutline} color="danger" />
          </div>

          <h2 className="login-title">Bienvenido</h2>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

          <IonList className="login-form">
            <IonItem>
              <IonLabel position="stacked">Correo electronico</IonLabel>
              <IonInput
                type="email"
                value={email}
                placeholder="tu@email.com"
                onIonChange={(e) => setEmail(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Contrasena</IonLabel>
              <IonInput
                type="password"
                value={password}
                placeholder="Tu contrasena"
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
            Iniciar Sesion
          </IonButton>

          <div className="login-footer">
            <IonText color="medium">
              <p>
                No tienes cuenta?{' '}
                <IonButton fill="clear" color="danger" onClick={goToRegister} className="link-button">
                  Registrate
                </IonButton>
              </p>
            </IonText>
          </div>
        </div>

        <IonAlert
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          header="Error de autenticacion"
          message="Correo o contrasena incorrectos. Si no tienes cuenta, registrate."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
