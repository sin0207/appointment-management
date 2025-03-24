import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://54.253.207.93:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
