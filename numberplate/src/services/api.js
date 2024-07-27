import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',  // Ensure this is the correct base URL for your server
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
