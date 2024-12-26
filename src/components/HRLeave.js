import React, { useState, useEffect } from 'react';
import { getFilteredLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from '../api/leaveApi';
import { toast } from 'react-toastify'; // Librairie pour afficher des notifications

const HRLeave = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        loadLeaveRequests();
    }, [typeFilter, statusFilter]);

    const loadLeaveRequests = async () => {
        try {
            const data = await getFilteredLeaveRequests(typeFilter, statusFilter);
            setLeaveRequests(data);
        } catch (error) {
            console.error('Erreur lors du chargement des demandes de congé:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveLeaveRequest(id);
            toast.success('Demande approuvée et notification envoyée.');
            loadLeaveRequests();
        } catch (error) {
            toast.error('Erreur lors de l\'approbation.');
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectLeaveRequest(id);
            toast.success('Demande rejetée et notification envoyée.');
            loadLeaveRequests();
        } catch (error) {
            toast.error('Erreur lors du rejet.');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">Approbation des Demandes de Congé</h2>

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
