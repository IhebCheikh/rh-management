import React, { useState, useEffect } from 'react';
import { getEmployeeReviews } from '../api/performanceApi';

const EmployeePerformance = () => {
    const [reviews, setReviews] = useState([]);
    const employeeId = localStorage.getItem('userId'); // ID employé connecté

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getEmployeeReviews(employeeId);
                // Trier les évaluations par date décroissante (plus récente en premier)
                const sortedReviews = data.sort(
                    (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
                );
                setReviews(sortedReviews);
            } catch (error) {
                console.error('Erreur lors de la récupération des évaluations :', error);
            }
        };
        fetchReviews();
    }, [employeeId]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Mes évaluations de performance</h1>
            {reviews.length === 0 ? (
                <p className="text-gray-500">Vous n'avez pas encore d'évaluations.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="border border-gray-300 p-4 mb-4 rounded-lg shadow-sm">
                        <p className="font-semibold"><strong>Période :</strong> {review.reviewPeriod}</p>
                        <p><strong>Commentaires :</strong> {review.comments}</p>
                        <p><strong>Nom de l'évaluateur :</strong> {review.reviewerName}</p>
                        <p><strong>Score :</strong> {review.scores}</p>
                        <p><strong>Date :</strong> {new Date(review.reviewPeriod).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default EmployeePerformance;
