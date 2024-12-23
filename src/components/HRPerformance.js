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
    const [showForm, setShowForm] = useState(false);

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

    const handleSaveReview = async () => {
        try {
            const reviewer = JSON.parse(localStorage.getItem('user')); // Récupérer les infos de l'évaluateur
            if (!reviewer) {
                console.error('Reviewer non trouvé dans le stockage local.');
                return;
            }

            const reviewData = {
                ...newReview,
                reviewerId: reviewer.id,
                reviewerName: reviewer.name,
            };

            if (editingReview) {
                await updateReview(editingReview._id, reviewData);
                setReviews(
                    reviews.map((review) =>
                        review._id === editingReview._id ? { ...review, ...reviewData } : review
                    )
                );
            } else {
                const createdReview = await createReview(reviewData);
                setReviews([...reviews, createdReview]);
            }

            setNewReview({ employeeId: '', reviewPeriod: '', scores: '', comments: '' });
            setEditingReview(null);
            setShowForm(false);
        } catch (error) {
            console.error('Erreur lors de l’enregistrement de l’évaluation :', error);
        }
    };

    const groupedReviews = reviews.reduce((acc, review) => {
        if (!acc[review.employeeName]) {
            acc[review.employeeName] = [];
        }
        acc[review.employeeName].push(review);
        return acc;
    }, {});

    const calculateAverageScore = (reviews) => {
        const total = reviews.reduce((sum, review) => sum + parseFloat(review.scores || 0), 0);
        return (total / reviews.length).toFixed(2);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold text-gray-700 mb-6">Évaluations des employés</h1>

                {/* Bouton pour afficher/masquer le formulaire */}
                <button
                    className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingReview(null);
                        setNewReview({ employeeId: '', reviewPeriod: '', scores: '', comments: '' });
                    }}
                >
                    {showForm ? 'Annuler' : 'Ajouter une évaluation'}
                </button>

                {/* Formulaire d'ajout/modification */}
                {showForm && (
                    <div className="bg-gray-200 p-4 rounded mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {editingReview ? 'Modifier l’évaluation' : 'Nouvelle évaluation'}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Employé :</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={newReview.employeeId}
                                onChange={(e) => {
                                    const selectedEmployee = employees.find(emp => emp._id === e.target.value);
                                    setNewReview({
                                        ...newReview,
                                        employeeId: selectedEmployee._id,
                                        employeeName: selectedEmployee.name,
                                    });
                                }}
                            >
                                <option value="">Sélectionnez un employé</option>
                                {employees.map((employee) => (
                                    <option key={employee._id} value={employee._id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Période d’évaluation :</label>
                            <input
                                type="month"
                                className="w-full p-2 border rounded"
                                value={newReview.reviewPeriod}
                                onChange={(e) => setNewReview({ ...newReview, reviewPeriod: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Score :</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                placeholder="Score"
                                value={newReview.scores}
                                onChange={(e) => setNewReview({ ...newReview, scores: parseInt(e.target.value, 10) })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Commentaires :</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                placeholder="Commentaires"
                                value={newReview.comments}
                                onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })}
                            />
                        </div>

                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleSaveReview}
                        >
                            {editingReview ? 'Enregistrer les modifications' : 'Ajouter'}
                        </button>
                    </div>
                )}

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
                                            onClick={() => {
                                                setEditingReview(review);
                                                setNewReview({
                                                    employeeId: review.employeeId,
                                                    reviewPeriod: review.reviewPeriod,
                                                    scores: review.scores,
                                                    comments: review.comments,
                                                });
                                                setShowForm(true);
                                            }}
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
                            <tr>
                                <td
                                    colSpan={5}
                                    className="border border-gray-300 px-4 py-2 font-semibold text-right"
                                >
                                    Moyenne des scores : {calculateAverageScore(groupedReviews[employeeName])}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default HRPerformance;
