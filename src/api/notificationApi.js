import axios from 'axios';

const notificationApiUrl = 'http://localhost:3001/notifications';

export const getUserNotifications = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${notificationApiUrl}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
