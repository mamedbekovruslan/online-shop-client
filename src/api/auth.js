import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const register = (data) => API.post("/register", data);
export const login = (data) => API.post("/login", data);
export const getCategories = () => API.get("/categories");
export const getProducts = (params) => API.get("/products", { params });
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const patchProduct = (id, data) => API.patch(`/products/${id}`, data);
export const placeOrder = (orderData) => API.post("/order", orderData);
