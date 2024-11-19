import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getUserLeaveRequests } from '../api/leaveApi'; // API pour récupérer les demandes de congé utilisateur

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [typeFilter, setTypeFilter] = useState(''); // Filtre pour le type
    const [statusFilter, setStatusFilter] = useState(''); // Filtre pour le statut
    const userId = localStorage.getItem('userId'); // Récupérer l'ID de l'utilisateur connecté

    useEffect(() => {
        fetchLeaveRequests();
    }, [userId, typeFilter, statusFilter]); // Recharger les données quand un filtre change

    const fetchLeaveRequests = async () => {
        try {
            // Appel API pour récupérer les demandes filtrées
            console.log(userId)
            console.log(typeFilter)
            console.log(statusFilter)
            const requests = await getUserLeaveRequests(userId, typeFilter, statusFilter);
            setLeaveRequests(requests); // Mettre à jour l'état avec les résultats
        } catch (error) {
            console.error("Erreur lors de la récupération des demandes de congé", error);
        }
    };

    const handleRequestLeave = () => {
        navigate('/employee-leave'); // Rediriger vers la page pour une nouvelle demande
    };

    return (
        <div>
            <h1>Tableau de bord des employés</h1>

            <button
                onClick={handleRequestLeave}
                className="px-4 py-2 bg-green-500 text-white rounded mt-4"
            >
                Demander un congé
            </button>

            {/* Filtres */}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Filtrer par type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="rejected">Rejeté</option>
                </select>
            </div>

            {/* Liste des demandes */}
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
                                <p><strong>Statut:</strong> {request.status}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;
