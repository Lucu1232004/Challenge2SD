import { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, people, person } from 'ionicons/icons';
import Visitas from './pages/Visitas';
import VisitaDetalle from './pages/VisitaDetalle';
import Pacientes from './pages/Pacientes';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import { getSession } from './lib/auth';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [session, setSession] = useState<any | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setReady(true);
  }, []);

  if (!ready) return null;

  // Sin sesión -> solo login (guarda sesión en localStorage)
  if (!session) {
    return (
      <IonApp>
        <Login onLogged={(s) => setSession(s)} />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/tabs/visitas" element={<Visitas />} />
            <Route path="/tabs/visitas/:id" element={<VisitaDetalle />} />
            <Route path="/tabs/pacientes" element={<Pacientes />} />
            <Route path="/tabs/perfil" element={<Perfil onLogout={() => setSession(null)} />} />
            <Route path="/" element={<Navigate to="/tabs/visitas" replace />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="visitas" href="/tabs/visitas">
              <IonIcon aria-hidden="true" icon={calendar} />
              <IonLabel>Visitas</IonLabel>
            </IonTabButton>
            <IonTabButton tab="pacientes" href="/tabs/pacientes">
              <IonIcon aria-hidden="true" icon={people} />
              <IonLabel>Pacientes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="perfil" href="/tabs/perfil">
              <IonIcon aria-hidden="true" icon={person} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
