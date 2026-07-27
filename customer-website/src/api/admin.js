import client from './client';

export const getAdminOrders = (params = {}) => client.get('admin/orders/', { params });

export const getAdminOrder = (orderNumber) => client.get(`admin/orders/${orderNumber}/`);

export const updateOrderStatus = (orderNumber, status) =>
  client.patch(`admin/orders/${orderNumber}/status/`, { status });

export const getCustomers = (params = {}) => client.get('auth/admin/customers/', { params });

// Inventory uses the products endpoint (already includes stock data)
export const getInventory = (params = {}) => client.get('products/', { params });
