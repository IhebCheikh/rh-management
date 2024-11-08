import axios from 'axios';

const API_URL = 'http://localhost:3001/auth';

export const register = async (name, email, password, role) => {
    return axios.post(`${API_URL}/signup`, { name, email, password, role });
};
/*
export const login = async (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
};
*/
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        console.log(response.data)
        return response.data; // Cela devrait retourner un objet avec le token JWT et l'info utilisateur
    } catch (error) {
        throw new Error('Login failed, please check your credentials');
    }
};
