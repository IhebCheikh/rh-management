import React, { useState } from 'react';
import axios from 'axios';

const TimeSheetForm = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [date, setDate] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/time-sheets/create', {
                employeeId,
                date,
                hoursWorked,
            });
            alert('Feuille de temps ajoutée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la feuille de temps', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Employee ID:</label>
                <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                />
            </div>
            <div>
                <label>Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div>
                <label>Hours Worked:</label>
                <input
                    type="number"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(e.target.value)}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default TimeSheetForm;
