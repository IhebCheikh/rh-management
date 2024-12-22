import React, { useState, useEffect } from 'react';
import { getEmployeeReviews } from '../api/performanceApi';

const EmployeePerformance = () => {
    const [reviews, setReviews] = useState([]);
    const employeeId = localStorage.getItem('userId'); // ID employé connecté

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getEmployeeReviews(employeeId);
                setReviews(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des évaluations :', error);
            }
        };
        fetchReviews();
    }, [employeeId]);

    return (
        <div>
            <h1>Mes évaluations de performance</h1>
            {reviews.length === 0 ? (
                <p>Vous n'avez pas encore d'évaluations.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                        <p><strong>Période :</strong> {review.reviewPeriod}</p>
                        <p><strong>Commentaires :</strong> {review.comments}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default EmployeePerformance;
