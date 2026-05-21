import { User, Product, Order, Address } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('fringe_auth_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  register: (body: { name: string; email: string; phone?: string; password: string }) =>
    request<{ user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (identifier: string, password: string) =>
    request<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  updateProfile: (body: { name?: string; email?: string; phone?: string }) =>
    request<{ user: User }>('/api/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  changePassword: (oldPassword: string, newPassword: string) =>
    request<{ message: string }>('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  forgotPassword: (identifier: string) =>
    request<{ message: string; devOtp?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),

  verifyOtp: (identifier: string, otp: string) =>
    request<{ message: string }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp }),
    }),

  resetPassword: (identifier: string, otp: string, password: string) =>
    request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp, password }),
    }),

  getProducts: (params?: {
    category?: string;
    search?: string;
    brand?: string;
    sort?: string;
    inStock?: boolean;
  }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    if (params?.brand) q.set('brand', params.brand);
    if (params?.sort) q.set('sort', params.sort);
    if (params?.inStock) q.set('inStock', 'true');
    const qs = q.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ''}`);
  },

  getProduct: (id: string) => request<Product>(`/api/products/${id}`),

  getCategories: () =>
    request<{ id: string; name: string; icon: string }[]>('/api/categories'),

  createProduct: (product: Product) =>
    request<{ product: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  deleteProduct: (id: string) =>
    request<{ message: string }>(`/api/products/${id}`, { method: 'DELETE' }),

  addReview: (productId: string, body: { comment: string; rating: number; city?: string }) =>
    request<{ product: Product }>(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getOrders: () => request<Order[]>('/api/orders'),

  placeOrder: (order: Order) =>
    request<{ order: Order }>('/api/orders', { method: 'POST', body: JSON.stringify(order) }),

  trackOrder: (orderId: string) => request<Order>(`/api/orders/track/${orderId}`),

  cancelOrder: (orderId: string) =>
    request<{ order: Order }>(`/api/orders/${orderId}/cancel`, { method: 'PATCH' }),

  getAddresses: () => request<Address[]>('/api/addresses'),

  addAddress: (addr: Omit<Address, 'id'>) =>
    request<Address>('/api/addresses', { method: 'POST', body: JSON.stringify(addr) }),

  setDefaultAddress: (id: string) =>
    request<{ message: string }>(`/api/addresses/${id}/default`, { method: 'PATCH' }),

  deleteAddress: (id: string) =>
    request<{ message: string }>(`/api/addresses/${id}`, { method: 'DELETE' }),

  getWishlist: () => request<Product[]>('/api/wishlist'),

  addToWishlist: (productId: string) =>
    request<{ product: Product }>(`/api/wishlist/${productId}`, { method: 'POST' }),

  removeFromWishlist: (productId: string) =>
    request<{ message: string }>(`/api/wishlist/${productId}`, { method: 'DELETE' }),

  syncWishlist: (productIds: string[]) =>
    request<{ message: string }>('/api/wishlist/sync', {
      method: 'PUT',
      body: JSON.stringify({ productIds }),
    }),

  getSellerProducts: () => request<Product[]>('/api/seller/products'),

  getSellerOrders: () => request<Order[]>('/api/seller/orders'),

  getSellerStats: () =>
    request<{ activeListings: number; totalOrders: number; pendingOrders: number; revenue: number }>(
      '/api/seller/stats'
    ),

  updateSellerOrderStatus: (orderId: string, status: string) =>
    request<{ order: Order }>(`/api/seller/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updateProduct: (id: string, data: Partial<Product>) =>
    request<{ product: Product }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
