import React, { useState, useEffect } from 'react';
import { createLeaveRequest } from '../api/leaveApi';

const EmployeeLeave = () => {
    const [type, setType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [employeeId, setEmployeeId] = useState('');

    // Récupérer l'ID de l'utilisateur au chargement du composant
    useEffect(() => {
        const id = localStorage.getItem('userId');
        if (id) {
            setEmployeeId(id);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createLeaveRequest(employeeId, type, startDate, endDate);
            alert('Demande de congé soumise');
        } catch (error) {
            console.error('Erreur lors de la soumission de la demande:', error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">Demande de Congé</h2>
            <form onSubmit={handleSubmit}>
                {/* Champ caché pour stocker l'ID de l'utilisateur */}
                <input type="hidden" value={employeeId} />

                <label className="block mb-2">Type de congé</label>
                <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Date de début</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Date de fin</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Soumettre
                </button>
            </form>
        </div>
    );
};

export default EmployeeLeave;
