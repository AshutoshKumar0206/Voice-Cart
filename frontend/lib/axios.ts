import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // if you're using cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
