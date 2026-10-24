// Router principal: login, registro y las tres secciones privadas.
import { ReactNode } from 'react';
import { Navigate, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonLoading,
  IonPage,
  IonContent,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NetworkProvider } from './contexts/NetworkContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import Fruits from './pages/Fruits';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

// Pantalla que se muestra mientras Firebase restaura la sesión
const LoadingScreen: React.FC = () => (
  <IonPage>
    <IonContent className="ion-padding">
      <IonLoading isOpen={true} message="Cargando..." />
    </IonContent>
  </IonPage>
);

// Envuelve una página y solo la muestra si hay sesión iniciada
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Redirige según el estado de la sesión al entrar a la raíz
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return <Navigate to={user ? '/app/contacts' : '/login'} replace />;
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <NetworkProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/app/contacts"
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/fruits"
              element={
                <ProtectedRoute>
                  <Fruits />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<RootRedirect />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </NetworkProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
