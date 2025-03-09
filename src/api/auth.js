import axios from "axios";

const API = axios.create({
  baseURL: "http://89.111.170.174:3000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Аутентификация
export const register = (data) => API.post("/register", data);
export const login = (data) => API.post("/login", data);

// Категории и товары
export const getCategories = () => API.get("/categories");
export const getProducts = (params) => API.get("/products", { params });
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addProduct = (data) => API.post("/products", data);
export const getProduct = (id) => API.get(`/products/${id}`);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const patchProduct = (id, data) => API.patch(`/products/${id}`, data);
export const placeOrder = (orderData) => API.post("/order", orderData);

// Пользователи
export const getUsers = () => API.get("/users");
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const addUser = (data) => API.post("/users", data);
