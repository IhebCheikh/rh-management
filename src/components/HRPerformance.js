import React, { useState, useEffect } from 'react';
import { getAllReviews, createReview, deleteReview, updateReview } from '../api/performanceApi';
import { getEmployees } from '../api/employeeApi';

const HRPerformance = () => {
    const [reviews, setReviews] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newReview, setNewReview] = useState({
        employeeId: '',
        reviewPeriod: '',
        scores: '',
        comments: '',
    });
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reviewsData, employeesData] = await Promise.all([
                    getAllReviews(),
                    getEmployees(),
                ]);
                setReviews(reviewsData);
                setEmployees(employeesData);
            } catch (error) {
                console.error('Erreur lors du chargement des données :', error);
            }
        };
        fetchData();
    }, []);

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            console.error('Erreur lors de la suppression de l’évaluation :', error);
        }
    };

    const handleAddReview = async () => {
        try {
            const createdReview = await createReview(newReview);
            setReviews([...reviews, createdReview]);
            setNewReview({ employeeId: '', reviewPeriod: '', scores: '', comments: '' });
        } catch (error) {
            console.error('Erreur lors de l’ajout de l’évaluation :', error);
        }
    };

    const handleUpdateReview = async () => {
        try {
            const updatedReview = await updateReview(editingReview._id, editingReview);
            setReviews(
                reviews.map((review) => (review._id === updatedReview._id ? updatedReview : review))
            );
            setEditingReview(null);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l’évaluation :', error);
        }
    };

    const groupedReviews = reviews.reduce((acc, review) => {
        if (!acc[review.employeeName]) {
            acc[review.employeeName] = [];
        }
        acc[review.employeeName].push(review);
        return acc;
    }, {});

    const calculateAverageScore = (employeeReviews) => {
        const totalScore = employeeReviews.reduce((sum, review) => sum + parseFloat(review.scores || 0), 0);
        return (totalScore / employeeReviews.length).toFixed(2);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold text-gray-700 mb-6">Évaluations des employés</h1>
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Employé</th>
                        <th className="border border-gray-300 px-4 py-2">Période</th>
                        <th className="border border-gray-300 px-4 py-2">Score</th>
                        <th className="border border-gray-300 px-4 py-2">Commentaires</th>
                        <th className="border border-gray-300 px-4 py-2">Évaluateur</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(groupedReviews).map((employeeName) => (
                        <React.Fragment key={employeeName}>
                            {groupedReviews[employeeName].map((review, index) => (
                                <tr key={review._id} className="bg-white hover:bg-gray-50">
                                    {index === 0 && (
                                        <td
                                            rowSpan={groupedReviews[employeeName].length + 1}
                                            className="border border-gray-300 px-4 py-2 font-semibold text-gray-800"
                                        >
                                            {employeeName}
                                        </td>
                                    )}
                                    <td className="border border-gray-300 px-4 py-2">{review.reviewPeriod}</td>
                                    <td className="border border-gray-300 px-4 py-2">{review.scores}</td>
                                    <td className="border border-gray-300 px-4 py-2">{review.comments}</td>
                                    <td className="border border-gray-300 px-4 py-2">{review.reviewerName}</td>
                                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                                        <button
                                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                            onClick={() => setEditingReview(review)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                                            onClick={() => handleDeleteReview(review._id)}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-100">
                                <td colSpan="5" className="border border-gray-300 px-4 py-2 text-right font-bold">
                                    Moyenne des scores : {calculateAverageScore(groupedReviews[employeeName])}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                                        onClick={() => setNewReview({ employeeId: '', reviewPeriod: '', scores: '', comments: '' })}
                                    >
                                        Ajouter
                                    </button>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

                {(editingReview || newReview.employeeId) && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            {editingReview ? 'Modifier l’évaluation' : 'Ajouter une évaluation'}
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                editingReview ? handleUpdateReview() : handleAddReview();
                            }}
                        >
                            <div className="grid grid-cols-1 gap-4">
                                <select
                                    className="border border-gray-300 rounded px-4 py-2"
                                    value={editingReview?.employeeId || newReview.employeeId}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (editingReview) {
                                            setEditingReview({ ...editingReview, employeeId: value });
                                        } else {
                                            setNewReview({ ...newReview, employeeId: value });
                                        }
                                    }}
                                >
                                    <option value="">Sélectionner un employé</option>
                                    {employees.map((employee) => (
                                        <option key={employee._id} value={employee._id}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded px-4 py-2"
                                    placeholder="Période d’évaluation"
                                    value={editingReview?.reviewPeriod || newReview.reviewPeriod}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (editingReview) {
                                            setEditingReview({ ...editingReview, reviewPeriod: value });
                                        } else {
                                            setNewReview({ ...newReview, reviewPeriod: value });
                                        }
                                    }}
                                />
                                <input
                                    type="number"
                                    className="border border-gray-300 rounded px-4 py-2"
                                    placeholder="Score"
                                    value={editingReview?.scores || newReview.scores}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (editingReview) {
                                            setEditingReview({ ...editingReview, scores: value });
                                        } else {
                                            setNewReview({ ...newReview, scores: value });
                                        }
                                    }}
                                />
                                <textarea
                                    className="border border-gray-300 rounded px-4 py-2"
                                    placeholder="Commentaires"
                                    value={editingReview?.comments || newReview.comments}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (editingReview) {
                                            setEditingReview({ ...editingReview, comments: value });
                                        } else {
                                            setNewReview({ ...newReview, comments: value });
                                        }
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-4 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                {editingReview ? 'Mettre à jour' : 'Ajouter'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRPerformance;
