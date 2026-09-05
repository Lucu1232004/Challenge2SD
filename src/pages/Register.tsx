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
          <IonTitle>Crear cuenta nueva</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding register-content">
        <div className="register-container">
          <div className="register-icon">
            <IonIcon icon={personAddOutline} color="danger" />
          </div>

          <h2 className="register-title">¡Únete a nosotros!</h2>
          <p className="register-subtitle">Crea tu cuenta y guarda tus contactos favoritos</p>

          <IonList className="register-form">
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
                placeholder="Mínimo 4 caracteres"
                onIonChange={(e) => setPassword(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Confirmar contraseña</IonLabel>
              <IonInput
                type="password"
                value={confirmPassword}
                placeholder="Repite tu contraseña"
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
            Crear mi cuenta
          </IonButton>

          <div className="register-footer">
            <IonText color="medium">
              <p>
                ¿Ya tienes cuenta?{' '}
                <IonButton fill="clear" color="danger" onClick={goToLogin} className="link-button">
                  Inicia sesión aquí
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
          header="¡Listo!"
          message="Tu cuenta se creó correctamente. ¡Bienvenido a tu agenda!"
          buttons={['Continuar']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
