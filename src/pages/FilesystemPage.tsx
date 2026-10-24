// Página de archivos: guardar, leer y borrar un texto en Documents.
import { useState } from 'react';
import { IonButton, IonIcon, IonNote, IonText, IonTextarea } from '@ionic/react';
import { folderOpenOutline, saveOutline, trashOutline } from 'ionicons/icons';
import SensorPage from '../components/SensorPage';
import { useFilesystem } from '../hooks/useFilesystem';
import './Sensors.css';

const FilesystemPage: React.FC = () => {
  const { status, error, save, read, remove, fileName } = useFilesystem();
  const [text, setText] = useState('');

  const handleRead = async () => {
    const content = await read();
    if (content !== null) setText(content);
  };

  const handleRemove = async () => {
    await remove();
    setText('');
  };

  return (
    <SensorPage title="Archivos">
      <p className="sensor-intro">
        Escribe un texto, guárdalo en el almacenamiento de la app y vuelve a leerlo cuando quieras.
      </p>

      <IonTextarea
        value={text}
        onIonInput={(event) => setText(event.detail.value || '')}
        placeholder="Escribe algo para guardar en el archivo..."
        autoGrow
        className="file-textarea"
      />

      <div className="sensor-actions">
        <IonButton onClick={() => save(text)} disabled={!text.trim()}>
          <IonIcon slot="start" icon={saveOutline} />
          Guardar
        </IonButton>
        <IonButton fill="outline" onClick={handleRead}>
          <IonIcon slot="start" icon={folderOpenOutline} />
          Leer
        </IonButton>
        <IonButton fill="outline" color="danger" onClick={handleRemove}>
          <IonIcon slot="start" icon={trashOutline} />
          Eliminar
        </IonButton>
      </div>

      {status && (
        <IonText color="success">
          <p>{status}</p>
        </IonText>
      )}
      {error && (
        <IonText color="danger">
          <p className="sensor-error">{error}</p>
        </IonText>
      )}

      <IonNote className="sensor-note">Ruta del archivo: Documents/{fileName}</IonNote>
    </SensorPage>
  );
};

export default FilesystemPage;
