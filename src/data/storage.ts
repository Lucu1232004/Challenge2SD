// Servicio para manejar localStorage
// Usado en Challenge 04 para persistencia de sesion

const STORAGE_KEY = 'logged';

export const isLoggedIn = (): boolean => {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'true';
};

export const setLoggedIn = (value: boolean): void => {
  localStorage.setItem(STORAGE_KEY, String(value));
};

export const clearAuth = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
