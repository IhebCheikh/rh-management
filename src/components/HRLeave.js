// src/components/HRLeaveDashboard.js
import React, { useState, useEffect } from 'react';
import { getLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from '../api/leaveApi';

const HRLeave = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);

    useEffect(() => {
        loadLeaveRequests();
    }, []);

    const loadLeaveRequests = async () => {
        try {
            const data = await getLeaveRequests();
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
