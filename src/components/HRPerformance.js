import React, { useState, useEffect } from 'react';
import { getAllReviews, createReview, updateReview, deleteReview } from '../api/performanceApi';

const HRPerformance = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        employeeId: '',
        employeeName: '',
        reviewPeriod: '',
        scores: {},
        comments: '',
    });

    // Charger toutes les évaluations
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getAllReviews();
                setReviews(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des évaluations :', error);
            }
        };
        fetchReviews();
    }, []);

    // Ajouter une nouvelle évaluation
    const handleCreateReview = async () => {
        try {
            const reviewerId = localStorage.getItem('userId'); // ID RH
            const reviewerName = localStorage.getItem('userName'); // Nom RH

            const reviewData = { ...newReview, reviewerId, reviewerName };
            const createdReview = await createReview(reviewData);
            setReviews([...reviews, createdReview]); // Mettre à jour la liste
            setNewReview({
                employeeId: '',
                employeeName: '',
                reviewPeriod: '',
                scores: {},
                comments: '',
            }); // Réinitialiser le formulaire
        } catch (error) {
            console.error('Erreur lors de la création de l’évaluation :', error);
        }
    };

    // Supprimer une évaluation
    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setReviews(reviews.filter((review) => review._id !== reviewId)); // Mettre à jour la liste
        } catch (error) {
            console.error('Erreur lors de la suppression de l’évaluation :', error);
        }
    };

    return (
        <div>
            <h1>Évaluations des employés</h1>

            {/* Formulaire pour ajouter une évaluation */}
            <div>
                <h2>Nouvelle évaluation</h2>
                <input
                    type="text"
                    placeholder="ID de l'employé"
                    value={newReview.employeeId}
                    onChange={(e) => setNewReview({ ...newReview, employeeId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Nom de l'employé"
                    value={newReview.employeeName}
                    onChange={(e) => setNewReview({ ...newReview, employeeName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Période d'évaluation"
                    value={newReview.reviewPeriod}
                    onChange={(e) => setNewReview({ ...newReview, reviewPeriod: e.target.value })}
                />
                <textarea
                    placeholder="Commentaires"
                    value={newReview.comments}
                    onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })}
                ></textarea>
                <button onClick={handleCreateReview}>Ajouter</button>
            </div>

            {/* Liste des évaluations */}
            <div>
                <h2>Liste des évaluations</h2>
                {reviews.map((review) => (
                    <div key={review._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                        <p><strong>Employé :</strong> {review.employeeName}</p>
                        <p><strong>Période :</strong> {review.reviewPeriod}</p>
                        <p><strong>Commentaires :</strong> {review.comments}</p>
                        <button onClick={() => handleDeleteReview(review._id)}>Supprimer</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HRPerformance;
