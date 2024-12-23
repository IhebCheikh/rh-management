import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimeSheetTable = () => {
    const [timeSheets, setTimeSheets] = useState([]);

    useEffect(() => {
        const fetchTimeSheets = async () => {
            try {
                const response = await axios.get('http://localhost:3000/time-sheets/employee/123'); // Utilisez l'ID de l'employé
                setTimeSheets(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des feuilles de temps', error);
            }
        };
        fetchTimeSheets();
    }, []);

    const handleValidate = async (id) => {
        try {
            await axios.put(`http://localhost:3000/time-sheets/validate/${id}`);
            alert('Feuille de temps validée');
            setTimeSheets(timeSheets.map(ts => ts._id === id ? { ...ts, validatedByHR: true } : ts));
        } catch (error) {
            console.error('Erreur lors de la validation de la feuille de temps', error);
        }
    };

    return (
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Heures travaillées</th>
                <th>Validée</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {timeSheets.map((timeSheet) => (
                <tr key={timeSheet._id}>
                    <td>{new Date(timeSheet.date).toLocaleDateString()}</td>
                    <td>{timeSheet.hoursWorked}</td>
                    <td>{timeSheet.validatedByHR ? 'Oui' : 'Non'}</td>
                    <td>
                        {!timeSheet.validatedByHR && (
                            <button onClick={() => handleValidate(timeSheet._id)}>Valider</button>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default TimeSheetTable;
