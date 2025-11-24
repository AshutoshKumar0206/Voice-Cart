import axios from 'axios';

const instance = axios.create({
  baseURL: '/api/backend',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
