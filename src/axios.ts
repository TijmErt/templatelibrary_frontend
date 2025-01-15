import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_NOSQL_URL + '/api/DocumentModelController',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
