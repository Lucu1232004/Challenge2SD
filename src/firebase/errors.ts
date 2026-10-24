// Traduce los códigos de error de Firebase a mensajes claros en español,
// para que el usuario entienda qué pasó sin tecnicismos raros.
export function getFirebaseErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code || '';
  const messages: Record<string, string> = {
    'auth/invalid-email': 'El correo no tiene un formato válido.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/wrong-password': 'La contraseña no es correcta.',
    'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Espera un momento y vuelve a intentarlo.',
    'auth/network-request-failed': 'No hay conexión a internet. Revisa tu red e intenta de nuevo.',
  };
  return messages[code] || 'Ocurrió un error inesperado. Intenta de nuevo.';
}
