// Router principal: define las páginas de la app y protege las rutas
// que solo pueden verse con sesión iniciada.
import { ReactNode } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonLoading, IonPage, IonContent, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import TaskFormPage from './pages/TaskFormPage';
import TaskDetail from './pages/TaskDetail';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
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
  return <Navigate to={user ? '/tasks' : '/login'} replace />;
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <TasksProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/new"
              element={
                <ProtectedRoute>
                  <TaskFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/edit/:id"
              element={
                <ProtectedRoute>
                  <TaskFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<RootRedirect />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </TasksProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
