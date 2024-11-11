import axios from 'axios';

const BASE_URL = 'http://localhost:3001/users/employees'; // Remplacez par l'URL de votre API si elle est différente

// Récupère tous les employés
export const getEmployees = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des employés:', error);
        throw error;
    }
};

// Crée un nouvel employé
export const createEmployee = async (employeeData) => {
    try {
        const response = await axios.post(`${BASE_URL}`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de l’employé:', error);
        throw error;
    }
};

// Met à jour un employé
export const updateEmployee = async (employeeId, employeeData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${employeeId}`, employeeData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’employé:', error);
        throw error;
    }
};

// Supprime un employé
export const deleteEmployee = async (employeeId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${employeeId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de l’employé:', error);
        throw error;
    }
};
