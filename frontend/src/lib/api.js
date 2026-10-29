import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api/v1/users`,
  withCredentials: true,
});

export default api;
