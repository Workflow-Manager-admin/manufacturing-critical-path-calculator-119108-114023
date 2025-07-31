import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env
    ? (import.meta as any).env.VITE_BACKEND_URL
    : process.env.VITE_BACKEND_URL) || 'http://localhost:8000/api/v1';

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
export async function loginUser(email: string, password: string) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function registerUser(email: string, password: string) {
  const res = await axios.post(`${API_URL}/auth/register`, { email, password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function fetchProducts(token: string) {
  const res = await axios.get<Product[]>(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function createProduct(token: string, data: Omit<Product, 'id'>) {
  const res = await axios.post(`${API_URL}/products`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateProduct(token: string, id: number, data: Omit<Product, 'id'>) {
  const res = await axios.put(`${API_URL}/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteProduct(token: string, id: number) {
  const res = await axios.delete(`${API_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function fetchOperations(token: string, productId?: number) {
  let url = `${API_URL}/operations`;
  if (productId) url += `?product_id=${productId}`;
  const res = await axios.get<Operation[]>(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function createOperation(token: string, data: Omit<Operation, 'id'>) {
  const res = await axios.post(`${API_URL}/operations`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateOperation(token: string, id: number, data: Omit<Operation, 'id'>) {
  const res = await axios.put(`${API_URL}/operations/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteOperation(token: string, id: number) {
  const res = await axios.delete(`${API_URL}/operations/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function calculateMCT(token: string, productId: number) {
  const res = await axios.get(`${API_URL}/mct/calculate?product_id=${productId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// PUBLIC_INTERFACE
export function decodeToken(token: string): Record<string, any> {
  return jwtDecode(token);
}
