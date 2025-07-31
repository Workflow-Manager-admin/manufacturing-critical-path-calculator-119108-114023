import jwt_decode from 'jwt-decode';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/v1';

export interface Product {
  id: number;
  name: string;
  description: string;
}

export interface Operation {
  id: number;
  name: string;
  product_id: number;
  step_number: number;
  mct_time: number;
}

// PUBLIC_INTERFACE
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json())?.message || 'Login failed');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json())?.message || 'Register failed');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function fetchProducts(token: string): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function createProduct(token: string, data: Omit<Product, 'id'>) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function updateProduct(token: string, id: number, data: Omit<Product, 'id'>) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function deleteProduct(token: string, id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function fetchOperations(token: string, productId?: number): Promise<Operation[]> {
  let url = `${API_URL}/operations`;
  if (productId) url += `?product_id=${productId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch operations');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function createOperation(token: string, data: Omit<Operation, 'id'>) {
  const res = await fetch(`${API_URL}/operations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create operation');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function updateOperation(token: string, id: number, data: Omit<Operation, 'id'>) {
  const res = await fetch(`${API_URL}/operations/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update operation');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function deleteOperation(token: string, id: number) {
  const res = await fetch(`${API_URL}/operations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete operation');
  return await res.json();
}

// PUBLIC_INTERFACE
export async function calculateMCT(token: string, productId: number) {
  const res = await fetch(`${API_URL}/mct/calculate?product_id=${productId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to calculate MCT');
  return await res.json();
}

// PUBLIC_INTERFACE
export function decodeToken(token: string): Record<string, any> {
  return jwt_decode(token);
}
