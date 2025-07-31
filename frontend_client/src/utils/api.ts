import axios from "axios";
import type { Product, Operation } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// PUBLIC_INTERFACE
export async function login(email: string, password: string) {
  /**
   * Authenticates the user and returns JWT token.
   */
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function register(email: string, password: string) {
  /**
   * Registers a new user.
   */
  const res = await apiClient.post("/auth/register", { email, password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function fetchProducts(token: string) {
  /**
   * Fetches all products for the logged-in user.
   */
  const res = await apiClient.get("/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function createProduct(token: string, product: Omit<Product, "id">) {
  /**
   * Creates a new product.
   */
  const res = await apiClient.post("/products", product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateProduct(token: string, productId: number, product: Omit<Product, "id">) {
  /**
   * Updates the given product.
   */
  const res = await apiClient.put(`/products/${productId}`, product, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteProduct(token: string, productId: number) {
  /**
   * Deletes the given product.
   */
  const res = await apiClient.delete(`/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function fetchOperations(token: string, productId?: number) {
  /**
   * Fetches all manufacturing operations, optionally for a specific product.
   */
  const url = productId ? `/operations?product_id=${productId}` : "/operations";
  const res = await apiClient.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function createOperation(token: string, operation: Omit<Operation, "id">) {
  /**
   * Creates a new operation.
   */
  const res = await apiClient.post("/operations", operation, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateOperation(token: string, operationId: number, operation: Omit<Operation, "id">) {
  /**
   * Updates a given operation.
   */
  const res = await apiClient.put(`/operations/${operationId}`, operation, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function deleteOperation(token: string, operationId: number) {
  /**
   * Deletes a given operation.
   */
  const res = await apiClient.delete(`/operations/${operationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUBLIC_INTERFACE
export async function calculateMCT(token: string, productId: number) {
  /**
   * Requests the backend to calculate the MCT for a product.
   */
  const res = await apiClient.get(`/mct/calculate?product_id=${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
