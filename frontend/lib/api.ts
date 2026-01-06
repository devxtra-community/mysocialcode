import axios from 'axios';
const api = axios.create({
  baseURL: 'http://10.222.145.137:4000',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});
export default api;
