import axios from 'axios';

const apiUrl = 'http://localhost:3001/leave-requests';

export const createLeaveRequestt = async (employeeId, type, startDate, endDate) => {
    const response = await axios.post(apiUrl, { employeeId, type, startDate, endDate });
    return response.data;
};
export const createLeaveRequest = async (employeeId, type, startDate, endDate) => {
    const token = localStorage.getItem('token');

    console.log('token:', token);
    console.log('employeeId:', employeeId);
    console.log('type:', type);
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    try {
        const response = await axios.post(
            `${apiUrl}`,
            { employeeId, type, startDate, endDate },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getLeaveRequests = async () => {
    const response = await axios.get(apiUrl);
    return response.data;
};
// Récupérer les demandes de congé d'un utilisateur
export const getUserLeaveRequestss = async (employeeId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${apiUrl}/my-requests/${employeeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fonction pour récupérer les demandes utilisateur avec filtres
export const getUserLeaveRequests = async (userId, type = '', status = '') => {
    const query = new URLSearchParams({ userId });
    if (type) query.append('type', type);
    if (status) query.append('status', status);

    const response = await fetch(`${apiUrl}/searchU?${query.toString()}`);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des demandes');
    }
    return response.json();
};
export const getFilteredLeaveRequests = async (type, status) => {
    const query = new URLSearchParams();
    if (type) query.append('type', type);
    if (status) query.append('status', status);

    const response = await fetch(`${apiUrl}/search?${query.toString()}`);
    return response.json();
};

export const approveLeaveRequest = async (id) => {
    const response = await axios.patch(`${apiUrl}/${id}/approve`);
    return response.data;
};

export const rejectLeaveRequest = async (id) => {
    const response = await axios.patch(`${apiUrl}/${id}/reject`);
    return response.data;
};
