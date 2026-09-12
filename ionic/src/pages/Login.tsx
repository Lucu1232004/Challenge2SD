import { useState } from 'react';
import {
  IonPage, IonContent, IonInput, IonItem, IonLabel,
  IonButton, IonCard, IonCardContent, IonToast, IonSegment, IonSegmentButton
} from '@ionic/react';

import { login, registerUser } from '../lib/auth';

export default function Login({ onLogged }: { onLogged: (s: any) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);

  function fail(msg: string) {
    setToast(msg);
    setShowToast(true); // IonToast cuando credenciales incorrectas (exige el parcial)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = login(identifier, password);
    if (!res.ok) {
      fail(res.error);
      return;
    }
    onLogged(res.session);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const res = registerUser({ name, username, email, password: regPass });
    if (!res.ok) {
      fail(res.error);
      return;
    }
    setMode('login');
    setIdentifier(username || email);
    setPassword('');
    setToast('Cuenta creada. Inicia sesión.');
    setShowToast(true);
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div style={{ maxWidth: 440, margin: '30px auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <svg width="58" height="58" viewBox="0 0 512 512">
              <rect width="512" height="512" rx="110" fill="#0B1210" />
              <rect x="14" y="14" width="484" height="484" rx="100" fill="none" stroke="#00D68F" strokeWidth="10" />
              <circle cx="256" cy="225" r="115" fill="#14201C" stroke="#00D68F" strokeWidth="10" />
              <polyline points="175,225 210,225 228,190 248,260 268,200 285,225 337,225" fill="none" stroke="#00D68F" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
              <text x="256" y="395" textAnchor="middle" fontFamily="Arial" fontWeight="800" fontSize="72" fill="#E6F4EF">SL</text>
            </svg>
            <div>
              <div className="brand-name">MediClinic</div>
              <div className="brand-sub">by Samuel Patiño Lucumi</div>
            </div>
          </div>
          <p style={{ color: '#9AB8AD' }}>Acceso del médico · visitas del día</p>

          <IonSegment value={mode} onIonChange={(e) => setMode(e.detail.value as any)} style={{ margin: '14px 0' }}>
            <IonSegmentButton value="login">Entrar</IonSegmentButton>
            <IonSegmentButton value="register">Registrarse</IonSegmentButton>
          </IonSegment>

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <IonCard className="med-card">
                <IonCardContent>
                  <IonItem lines="full">
                    <IonLabel position="stacked">Usuario o correo</IonLabel>
                    <IonInput value={identifier} onIonInput={(e) => setIdentifier(e.detail.value || '')} autocomplete="username" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel position="stacked">Contraseña</IonLabel>
                    <IonInput type="password" value={password} onIonInput={(e) => setPassword(e.detail.value || '')} autocomplete="current-password" />
                  </IonItem>
                </IonCardContent>
              </IonCard>
              <IonButton expand="block" type="submit" color="primary" style={{ marginTop: 12 }}>
                Iniciar sesión
              </IonButton>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <IonCard className="med-card">
                <IonCardContent>
                  <IonItem><IonLabel position="stacked">Nombre</IonLabel><IonInput value={name} onIonInput={(e) => setName(e.detail.value || '')} /></IonItem>
                  <IonItem><IonLabel position="stacked">Usuario</IonLabel><IonInput value={username} onIonInput={(e) => setUsername(e.detail.value || '')} /></IonItem>
                  <IonItem><IonLabel position="stacked">Correo</IonLabel><IonInput value={email} onIonInput={(e) => setEmail(e.detail.value || '')} /></IonItem>
                  <IonItem lines="none"><IonLabel position="stacked">Contraseña</IonLabel><IonInput type="password" value={regPass} onIonInput={(e) => setRegPass(e.detail.value || '')} /></IonItem>
                </IonCardContent>
              </IonCard>
              <IonButton expand="block" type="submit" color="primary" style={{ marginTop: 12 }}>
                Crear cuenta
              </IonButton>
            </form>
          )}

          <IonToast
            isOpen={showToast}
            message={toast}
            duration={2200}
            color="danger"
            onDidDismiss={() => setShowToast(false)}
          />
        </div>
      </IonContent>
    </IonPage>
  );
}
