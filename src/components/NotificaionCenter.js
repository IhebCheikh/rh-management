import React, { useState, useEffect } from 'react';
import { getUserNotifications } from '../api/notificationApi';

const NotificationCenter = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [employeeId, setEmployeeId] = useState('');

    // Récupérer l'ID de l'utilisateur au chargement du composant
    useEffect(() => {
        const id = localStorage.getItem('userId');
        console.log("id",id)
        if (id) {
            setEmployeeId(id);
            loadNotifications(id);
        }
    }, []);


    const loadNotifications = async (id) => {
        try {
            console.log("Emp_id", employeeId);
            console.log("id", id);
            const data = await getUserNotifications(id);
            setNotifications(data);
        } catch (error) {
            console.error('Erreur lors du chargement des notifications:', error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">Notifications</h2>
            {notifications.map((notification) => (
                <div key={notification._id} className="mb-4 border p-4 rounded">
                    <p>{notification.message}</p>
                </div>
            ))}
        </div>
    );
};

export default NotificationCenter;
