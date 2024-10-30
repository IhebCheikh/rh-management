import axios from 'axios';

const API_URL = 'http://localhost:3001/auth';

export const register = async (name, email, password, role) => {
    return axios.post(`${API_URL}/register`, { name, email, password, role });
};

export const login = async (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
};
