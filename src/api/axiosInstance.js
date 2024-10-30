import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000', // URL de base du backend
});

instance.interceptors.request.use((config) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.access_token) {
        config.headers.Authorization = `Bearer ${userData.access_token}`;
    }
    return config;
});

export default instance;
