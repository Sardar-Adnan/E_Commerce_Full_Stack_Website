import client from './client';

export const checkout = (data) => client.post('orders/checkout/', data);

export const getOrders = (params = {}) => client.get('orders/', { params });

export const getOrder = (orderNumber) => client.get(`orders/${orderNumber}/`);

export const cancelOrder = (orderNumber) => client.post(`orders/${orderNumber}/cancel/`);
