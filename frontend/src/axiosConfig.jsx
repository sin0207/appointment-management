import axios from 'axios';

const axiosInstance = axios.create({
  // by using defined backend api ip and port
  baseURL: 'http://3.104.106.154:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
