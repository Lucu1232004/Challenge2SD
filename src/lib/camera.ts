// Captura una foto con la cámara del teléfono (o la galería en web)
// y la devuelve como Blob lista para subir a Supabase Storage.
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export async function captureAvatar(): Promise<Blob | null> {
  const photo = await Camera.getPhoto({
    quality: 80,
    width: 512,
    height: 512,
    allowEditing: true,
    correctOrientation: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader: 'Foto de perfil',
    promptLabelPhoto: 'Elegir de la galería',
    promptLabelPicture: 'Tomar una foto',
    promptLabelCancel: 'Cancelar',
  });

  if (!photo.dataUrl) return null;

  const response = await fetch(photo.dataUrl);
  return response.blob();
}

export function isCameraCancel(error: unknown): boolean {
  const message = (error as { message?: string })?.message?.toLowerCase() ?? '';
  return message.includes('cancel') || message.includes('cancelled');
}
