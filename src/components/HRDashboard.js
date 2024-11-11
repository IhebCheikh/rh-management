import React, { useState, useEffect } from 'react';
import { getEmployees, updateEmployee, deleteEmployee } from '../api/employeeApi';

const HRDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (error) {
            console.error('Erreur lors du chargement des employés:', error);
        }
    };

    const handleUpdateEmployee = async () => {
        if (selectedEmployee) {
            try {
                await updateEmployee(selectedEmployee._id, {
                    department: selectedEmployee.department,
                    startDate: selectedEmployee.startDate,
                });
                loadEmployees();
                setSelectedEmployee(null);
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'employé:", error);
            }
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        try {
            await deleteEmployee(employeeId);
            loadEmployees();
        } catch (error) {
            console.error('Erreur lors de la suppression de l’employé:', error);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold text-gray-700 mb-6">Gestion des Employés</h1>

                <h2 className="text-xl font-medium text-gray-600 mb-4">Liste des employés</h2>
                <ul className="space-y-4">
                    {employees.map((employee) => (
                        <li key={employee._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                            <div>
                                <p className="font-medium text-gray-800">{employee.name}</p>
                                <p className="text-sm text-gray-500">{employee.role} - {employee.department} - {new Date(employee.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                    onClick={() => setSelectedEmployee(employee)}
                                >
                                    Modifier
                                </button>
                                <button
                                    className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                                    onClick={() => handleDeleteEmployee(employee._id)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {selectedEmployee && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
                        <h2 className="text-xl font-medium text-gray-600 mb-4">Modifier l'employé</h2>
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div>
                                <label className="block text-gray-600 mb-1">Département</label>
                                <input
                                    type="text"
                                    placeholder="Département"
                                    value={selectedEmployee.department}
                                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">Date de début</label>
                                <input
                                    type="date"
                                    value={selectedEmployee.startDate}
                                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    onClick={handleUpdateEmployee}
                                >
                                    Mettre à jour
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    onClick={() => setSelectedEmployee(null)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRDashboard;
