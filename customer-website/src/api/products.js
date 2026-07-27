import client from './client';

export const getProducts = (params = {}) => client.get('products/', { params });

export const getProduct = (slug) => client.get(`products/${slug}/`);

export const getCategories = (params = {}) => client.get('categories/', { params });
