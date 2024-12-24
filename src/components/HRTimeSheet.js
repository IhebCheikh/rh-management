import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Pour récupérer l'ID de l'employé
import { getTimeSheet, validateTimeSheet } from '../api/employeeApi'; // API pour récupérer et valider le timesheet

const HRTimeSheet = () => {
    const { employeeId } = useParams(); // Récupère l'ID de l'employé depuis l'URL
    const [employeeName, setEmployeeName] = useState(''); // Nom de l'employé
    const [timeSheet, setTimeSheet] = useState([]);

    useEffect(() => {
        loadTimeSheet();
    }, []);

    const loadTimeSheet = async () => {
        try {
            const data = await getTimeSheet(employeeId);
            if (Array.isArray(data) && data.length > 0) {
                setEmployeeName(data[0].employeeName || 'Nom inconnu');
                setTimeSheet(data);
            } else {
                console.error('Données inattendues:', data);
                setTimeSheet([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du timesheet:', error);
            setTimeSheet([]);
        }
    };

    const handleValidation = async (id) => {
        try {
            await validateTimeSheet(id);
            setTimeSheet((prevTimeSheet) =>
                prevTimeSheet.map((entry) =>
                    entry._id === id ? { ...entry, validatedByHR: true } : entry
                )
            );
        } catch (error) {
            console.error('Erreur lors de la validation:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold text-gray-700 mb-6">Time Sheet</h1>
                {timeSheet.length === 0 ? (
                    <p className="text-gray-500">Chargement des données...</p>
                ) : (
                    <>
                        <h2 className="text-lg font-medium text-gray-600 mb-4">
                            Employé: {employeeName}
                        </h2>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">Session 1</th>
                                <th className="border border-gray-300 px-4 py-2">Session 2</th>
                                <th className="border border-gray-300 px-4 py-2">Session 3</th>
                                <th className="border border-gray-300 px-4 py-2">Session 4</th>
                                <th className="border border-gray-300 px-4 py-2">Validation</th>
                            </tr>
                            </thead>
                            <tbody>
                            {timeSheet.map((entry) => (
                                <tr key={entry._id} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {entry.session1 ? 'Yes' : 'No'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {entry.session2 ? 'Yes' : 'No'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {entry.session3 ? 'Yes' : 'No'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {entry.session4 ? 'Yes' : 'No'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {entry.validatedByHR ? (
                                            <span className="text-green-600 font-semibold">Validated</span>
                                        ) : (
                                            <input
                                                type="checkbox"
                                                onChange={() => handleValidation(entry._id)}
                                                className="form-checkbox h-5 w-5 text-green-600"
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default HRTimeSheet;
