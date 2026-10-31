// Traduce los errores de Supabase a mensajes claros en español.

function getMessage(error: unknown): string {
  return (error as { message?: string })?.message?.toLowerCase() ?? '';
}

export function getAuthErrorMessage(error: unknown): string {
  const message = getMessage(error);

  if (message.includes('invalid login credentials')) {
    return 'El correo o la contraseña no son correctos.';
  }
  if (message.includes('email not confirmed')) {
    return 'Debes confirmar tu correo antes de iniciar sesión.';
  }
  if (message.includes('user already registered')) {
    return 'Ya existe una cuenta con ese correo.';
  }
  if (message.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (message.includes('unable to validate email address')) {
    return 'El correo no tiene un formato válido.';
  }
  if (message.includes('signup requires a valid password')) {
    return 'Escribe una contraseña válida.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Demasiados intentos seguidos. Espera un momento y vuelve a intentarlo.';
  }
  if (message.includes('over_email_send_rate_limit') || message.includes('email rate limit exceeded')) {
    return 'Supabase alcanzó el límite de correos de confirmación. Desactiva "Confirm email" o espera unos minutos.';
  }
  if (message.includes('email_address_invalid')) {
    return 'Supabase rechazó ese correo. Usa un dominio real, por ejemplo gmail.com.';
  }
  if (message.includes('signups not allowed')) {
    return 'El registro de usuarios está deshabilitado en Supabase.';
  }
  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'No hay conexión con Supabase. Revisa tu red e intenta de nuevo.';
  }

  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

export function getDataErrorMessage(error: unknown): string {
  const message = getMessage(error);

  if (message.includes('row-level security')) {
    return 'No tienes permisos para hacer esa operación.';
  }
  if (message.includes('duplicate key')) {
    return 'Ese registro ya existe.';
  }
  if (message.includes('jwt expired')) {
    return 'Tu sesión expiró. Vuelve a iniciar sesión.';
  }
  if (message.includes('permission denied')) {
    return 'Supabase rechazó la operación. Revisa las políticas RLS.';
  }
  if (message.includes('bucket not found')) {
    return 'El bucket de avatares no existe. Ejecuta el SQL del proyecto.';
  }
  if (message.includes('payload too large')) {
    return 'La imagen es demasiado grande. Intenta con una más pequeña.';
  }
  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'No hay conexión con Supabase. Revisa tu red e intenta de nuevo.';
  }

  return 'No se pudo completar la operación. Intenta de nuevo.';
}
