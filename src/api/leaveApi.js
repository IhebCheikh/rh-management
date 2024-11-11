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
export const getUserLeaveRequests = async (employeeId) => {
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

export const approveLeaveRequest = async (id) => {
    const response = await axios.patch(`${apiUrl}/${id}/approve`);
    return response.data;
};

export const rejectLeaveRequest = async (id) => {
    const response = await axios.patch(`${apiUrl}/${id}/reject`);
    return response.data;
};
