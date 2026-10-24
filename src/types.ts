// Tipos compartidos por las tres secciones del Challenge 06.

export interface Contact {
  id?: string;
  name: string;
  phone: string;
  age: number;
  city: string;
  ownerId: string;
  createdAt: string;
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface Fruit {
  id?: number;
  name: string;
  price: number;
  stock: number;
}
