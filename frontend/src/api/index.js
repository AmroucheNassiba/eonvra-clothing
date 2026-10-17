import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Products
export const getProducts = (params = {}) =>
  api.get('/shop/products/', { params })

export const getProduct = (slug) =>
  api.get(`/shop/products/${slug}/`)

export const getCategories = () =>
  api.get('/shop/categories/')

// Orders
export const createOrder = (orderData) =>
  api.post('/shop/orders/', orderData)

// Newsletter
export const subscribeNewsletter = (email) =>
  api.post('/shop/newsletter/', { email })

// Instagram
export const getInstagramFeed = (limit = 9) =>
  api.get('/instagram/feed/', { params: { limit } })

export default api
