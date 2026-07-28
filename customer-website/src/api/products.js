import client from './client';

export const getProducts = (params = {}) => client.get('products/', { params });

export const getProduct = (slug) => client.get(`products/${slug}/`);

export const getCategories = (params = {}) => client.get('categories/', { params });

export const createProduct = (data) => client.post('products/', data);

export const updateProduct = (slug, data) => client.patch(`products/${slug}/`, data);

export const deleteProduct = (slug) => client.delete(`products/${slug}/`);
