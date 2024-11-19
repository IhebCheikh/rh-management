import React, { useState, useEffect } from 'react';
import { getFilteredLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from '../api/leaveApi'; // Nouvelle API pour filtrer

const HRLeave = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [typeFilter, setTypeFilter] = useState(''); // État pour le filtre type
    const [statusFilter, setStatusFilter] = useState(''); // État pour le filtre statut

    useEffect(() => {
        loadLeaveRequests();
    }, [typeFilter, statusFilter]); // Recharger lorsque les filtres changent

    const loadLeaveRequests = async () => {
        try {
            const data = await getFilteredLeaveRequests(typeFilter, statusFilter); // Utilisation de l'API filtrée
            setLeaveRequests(data);
        } catch (error) {
            console.error('Erreur lors du chargement des demandes de congé:', error);
        }
    };

    const handleApprove = async (id) => {
        await approveLeaveRequest(id);
        loadLeaveRequests();
    };

    const handleReject = async (id) => {
        await rejectLeaveRequest(id);
        loadLeaveRequests();
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">Approbation des Demandes de Congé</h2>

            {/* Filtres */}
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Filtrer par type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="border p-2 mr-2 rounded"
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
            {leaveRequests.map((request) => (
                <div key={request._id} className="mb-4 border p-4 rounded">
                    <p>Type: {request.type}</p>
                    <p>Dates: {request.startDate} - {request.endDate}</p>
                    <p>Statut: {request.status}</p>
                    <button onClick={() => handleApprove(request._id)} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">
                        Approuver
                    </button>
                    <button onClick={() => handleReject(request._id)} className="px-4 py-2 bg-red-500 text-white rounded">
                        Rejeter
                    </button>
                </div>
            ))}
        </div>
    );
};

export default HRLeave;
