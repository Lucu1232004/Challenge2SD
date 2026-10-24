// Barra inferior compartida por las tres secciones.
// Navega con React Router para evitar el choque de outlets anidados.
import { IonFooter, IonToolbar, IonButton, IonIcon, IonLabel } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { peopleOutline, checkboxOutline, basketOutline } from 'ionicons/icons';
import './AppTabBar.css';

type TabKey = 'contacts' | 'tasks' | 'fruits';

interface AppTabBarProps {
  active: TabKey;
}

const tabs: { key: TabKey; label: string; icon: string; path: string }[] = [
  { key: 'contacts', label: 'Contactos', icon: peopleOutline, path: '/app/contacts' },
  { key: 'tasks', label: 'Tareas', icon: checkboxOutline, path: '/app/tasks' },
  { key: 'fruits', label: 'Frutas', icon: basketOutline, path: '/app/fruits' },
];

const AppTabBar: React.FC<AppTabBarProps> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <IonFooter>
      <IonToolbar className="app-tab-bar">
        {tabs.map((tab) => (
          <IonButton
            key={tab.key}
            fill="clear"
            className={`app-tab-button ${active === tab.key ? 'app-tab-active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <IonIcon icon={tab.icon} />
            <IonLabel>{tab.label}</IonLabel>
          </IonButton>
        ))}
      </IonToolbar>
    </IonFooter>
  );
};

export default AppTabBar;
