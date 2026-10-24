// Sección de frutas: base local con Dexie, disponible sin conexión.
import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonInput,
  IonAlert,
  IonNote,
  IonBadge,
} from '@ionic/react';
import { addOutline, createOutline, trashOutline, basketOutline, cashOutline } from 'ionicons/icons';
import AppHeader from '../components/AppHeader';
import AppTabBar from '../components/AppTabBar';
import { useDexie } from '../hooks/useDexie';
import { Fruit } from '../types';
import './DataPages.css';

const emptyForm = { name: '', price: '', stock: '' };

const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const Fruits: React.FC = () => {
  const { fruits, addFruit, updateFruit, removeFruit } = useDexie();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Fruit | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [fruitToDelete, setFruitToDelete] = useState<Fruit | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const totalValue = fruits.reduce((sum, fruit) => sum + fruit.price * fruit.stock, 0);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (fruit: Fruit) => {
    setEditing(fruit);
    setForm({
      name: fruit.name,
      price: String(fruit.price),
      stock: String(fruit.stock),
    });
    setIsModalOpen(true);
  };

  const askDelete = (fruit: Fruit) => {
    setFruitToDelete(fruit);
    setShowDeleteAlert(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
      };

      if (editing?.id !== undefined) {
        await updateFruit(editing.id, payload);
      } else {
        await addFruit(payload);
      }

      setIsModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (fruitToDelete?.id !== undefined) {
      try {
        await removeFruit(fruitToDelete.id);
      } catch (err) {
        console.error(err);
      }
    }
    setFruitToDelete(null);
  };

  return (
    <IonPage>
      <AppHeader title="Frutas" />
      <IonContent>
        <IonNote color="success" className="network-note">
          Guardado local con Dexie. Esta sección funciona sin conexión.
        </IonNote>

        <div className="stats-row">
          <div className="stat-card">
            <IonIcon icon={basketOutline} color="success" />
            <span className="stat-value">{fruits.length}</span>
            <span className="stat-label">Frutas</span>
          </div>
          <div className="stat-card">
            <IonIcon icon={cashOutline} color="primary" />
            <span className="stat-value">{money.format(totalValue)}</span>
            <span className="stat-label">Valor del inventario</span>
          </div>
        </div>

        {fruits.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={basketOutline} size="large" color="medium" />
            <h2>No tienes frutas</h2>
            <p>Toca el botón + para agregar la primera.</p>
          </div>
        ) : (
          <IonList className="data-list">
            {fruits.map((fruit) => (
              <IonItem key={fruit.id} className="data-item">
                <IonLabel>
                  <h2>{fruit.name}</h2>
                  <p>
                    {money.format(fruit.price)} · {fruit.stock} unidades
                  </p>
                </IonLabel>
                <IonBadge slot="end" color="success">
                  Local
                </IonBadge>
                <IonButton
                  fill="clear"
                  onClick={() => openEdit(fruit)}
                  aria-label="Editar fruta"
                >
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => askDelete(fruit)}
                  aria-label="Eliminar fruta"
                >
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openCreate} aria-label="Agregar fruta">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonModal id="fruit-modal" isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editing ? 'Editar fruta' : 'Nueva fruta'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsModalOpen(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nombre *</IonLabel>
                <IonInput
                  value={form.name}
                  placeholder="Ej: Mango"
                  onIonInput={(e) => setForm({ ...form, name: e.detail.value || '' })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Precio</IonLabel>
                <IonInput
                  type="number"
                  value={form.price}
                  placeholder="2500"
                  onIonInput={(e) => setForm({ ...form, price: e.detail.value || '' })}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Cantidad</IonLabel>
                <IonInput
                  type="number"
                  value={form.stock}
                  placeholder="10"
                  onIonInput={(e) => setForm({ ...form, stock: e.detail.value || '' })}
                />
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </IonButton>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Eliminar fruta"
          message={`¿Seguro que quieres eliminar "${fruitToDelete?.name || 'esta fruta'}"?`}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: () => {
                void confirmDelete();
              },
            },
          ]}
        />
      </IonContent>
      <AppTabBar active="fruits" />
    </IonPage>
  );
};

export default Fruits;
