import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_ENZO_API_BASE_URL,
  timeout: 30000,
});

export default api;
