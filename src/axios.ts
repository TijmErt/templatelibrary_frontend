import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081/api/DocumentModelController',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
