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
  IonButtons,
} from '@ionic/react';
import { personAddOutline, arrowBackOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { register } from '../data/auth';
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegister = () => {
    // Validaciones
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Completa todos los campos');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contrasenas no coinciden');
      setShowError(true);
      return;
    }

    if (password.length < 4) {
      setErrorMessage('La contrasena debe tener al menos 4 caracteres');
      setShowError(true);
      return;
    }

    const result = register(email, password);

    if (result.success) {
      setShowSuccess(true);
    } else {
      setErrorMessage(result.message);
      setShowError(true);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger">
          <IonButtons slot="start">
            <IonButton onClick={goToLogin}>
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Crear Cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding register-content">
        <div className="register-container">
          <div className="register-icon">
            <IonIcon icon={personAddOutline} color="danger" />
          </div>

          <h2 className="register-title">Registrate</h2>
          <p className="register-subtitle">Crea tu cuenta para empezar</p>

          <IonList className="register-form">
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
                placeholder="Minimo 4 caracteres"
                onIonChange={(e) => setPassword(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Confirmar contrasena</IonLabel>
              <IonInput
                type="password"
                value={confirmPassword}
                placeholder="Repite tu contrasena"
                onIonChange={(e) => setConfirmPassword(e.detail.value || '')}
              />
            </IonItem>
          </IonList>

          <IonButton
            expand="block"
            color="danger"
            className="ion-margin-top register-button"
            onClick={handleRegister}
          >
            <IonIcon slot="start" icon={personAddOutline} />
            Crear Cuenta
          </IonButton>

          <div className="register-footer">
            <IonText color="medium">
              <p>
                Ya tienes cuenta?{' '}
                <IonButton fill="clear" color="danger" onClick={goToLogin} className="link-button">
                  Inicia sesion
                </IonButton>
              </p>
            </IonText>
          </div>
        </div>

        <IonAlert
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          header="Error"
          message={errorMessage}
          buttons={['OK']}
        />

        <IonAlert
          isOpen={showSuccess}
          onDidDismiss={() => {
            setShowSuccess(false);
            navigate('/home', { replace: true });
          }}
          header="Registro exitoso"
          message="Tu cuenta ha sido creada. Bienvenido!"
          buttons={['Continuar']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
