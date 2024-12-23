import axios from 'axios';

const apiUrl = 'http://localhost:3001/performance';

// Récupérer les évaluations pour un employé
export const getEmployeeReviews = async (employeeId) => {
    const response = await axios.get(`${apiUrl}/${employeeId}`);
    return response.data;
};

// Récupérer toutes les évaluations (RH)
export const getAllReviews = async () => {
    const response = await axios.get(`${apiUrl}`);
    return response.data;
};

// Ajouter une évaluation
export const createReview = async (reviewData) => {
    const response = await axios.post(apiUrl, reviewData);
    return response.data;
};

// Mettre à jour une évaluation
export const updateReview = async (reviewId, updates) => {
    const response = await axios.patch(`${apiUrl}/${reviewId}`, updates);
    return response.data;
};

// Supprimer une évaluation
export const deleteReview = async (reviewId) => {
    await axios.delete(`${apiUrl}/${reviewId}`);
};
