import axios from 'axios';
const api = axios.create({
  baseURL: 'http://172.28.32.1:4000',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;
