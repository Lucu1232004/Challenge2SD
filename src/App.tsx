// Router principal del Parcial 2.
import { ReactNode } from 'react';
import { Navigate, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonLoading,
  IonPage,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import MissionsPage from './pages/MissionsPage';
import PhotoMissionPage from './pages/PhotoMissionPage';
import MovementMissionPage from './pages/MovementMissionPage';
import StillnessMissionPage from './pages/StillnessMissionPage';
import ResultsPage from './pages/ResultsPage';

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

const LoadingScreen: React.FC = () => (
  <IonPage>
    <IonContent className="ion-padding">
      <IonLoading isOpen={true} message="Cargando..." />
    </IonContent>
  </IonPage>
);

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return <Navigate to={user ? '/missions' : '/login'} replace />;
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/missions"
            element={
              <ProtectedRoute>
                <MissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/missions/photo"
            element={
              <ProtectedRoute>
                <PhotoMissionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/missions/movement"
            element={
              <ProtectedRoute>
                <MovementMissionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/missions/stillness"
            element={
              <ProtectedRoute>
                <StillnessMissionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<RootRedirect />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
