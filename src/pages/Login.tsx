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
import { logInOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { setLoggedIn } from '../data/storage';
import './Login.css';

const VALID_EMAIL = 'user@mail.com';
const VALID_PASSWORD = '123';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLogin = () => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setLoggedIn(true);
      navigate('/home', { replace: true });
    } else {
      setShowError(true);
    }
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
                placeholder="user@mail.com"
                onIonChange={(e) => setEmail(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Contrasena</IonLabel>
              <IonInput
                type="password"
                value={password}
                placeholder="123"
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

          <IonText color="medium" className="ion-text-center login-hint">
            <p>
              <IonIcon icon={mailOutline} /> user@mail.com
              <br />
              <IonIcon icon={lockClosedOutline} /> 123
            </p>
          </IonText>
        </div>

        <IonAlert
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          header="Error de autenticacion"
          message="Correo o contrasena incorrectos. Intenta de nuevo."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
