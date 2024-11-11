import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getUserLeaveRequests } from '../api/leaveApi'; // Importer la fonction pour récupérer les demandes de congé

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const userId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur connecté depuis le localStorage ou un autre moyen

    // Utiliser useEffect pour récupérer les demandes de congé à chaque chargement du composant
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const requests = await getUserLeaveRequests(userId); // Appeler l'API avec l'ID de l'utilisateur
                setLeaveRequests(requests); // Mettre à jour l'état avec les demandes de congé
            } catch (error) {
                console.error("Erreur lors de la récupération des demandes de congé", error);
            }
        };

        fetchLeaveRequests();
    }, [userId]); // L'effet se déclenche à chaque changement d'ID utilisateur

    const handleRequestLeave = () => {
        navigate('/employee-leave'); // Rediriger vers la page pour faire une nouvelle demande
    };

    return (
        <div>
            <h1>Tableau de bord</h1>

            <button
                onClick={handleRequestLeave}
                className="px-4 py-2 bg-green-500 text-white rounded mt-4"
            >
                Demander un congé
            </button>

            {/* Liste des demandes de congé */}
            <div className="mt-6">
                <h2>Mes demandes de congé</h2>
                {leaveRequests.length === 0 ? (
                    <p>Aucune demande de congé en cours.</p>
                ) : (
                    <ul>
                        {leaveRequests.map((request) => (
                            <li key={request._id} className="border-b py-2">
                                <p><strong>Type de congé:</strong> {request.type}</p>
                                <p><strong>Date de début:</strong> {new Date(request.startDate).toLocaleDateString()}</p>
                                <p><strong>Date de fin:</strong> {new Date(request.endDate).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {request.status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;
