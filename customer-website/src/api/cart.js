import client from './client';

export const getCart = () => client.get('cart/');

export const addItem = (data) => client.post('cart/items/', data);

export const updateItem = (id, quantity) => client.patch(`cart/items/${id}/`, { quantity });

export const removeItem = (id) => client.delete(`cart/items/${id}/`);

export const clearCart = () => client.delete('cart/clear/');
