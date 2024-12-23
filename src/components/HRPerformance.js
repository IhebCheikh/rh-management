import React, { useState, useEffect } from 'react';
import { getAllReviews, createReview, deleteReview } from '../api/performanceApi';
import { getEmployees} from '../api/employeeApi';

const HRPerformance = () => {
    const [reviews, setReviews] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [newReview, setNewReview] = useState({
        employeeId: '',
        employeeName: '',
        reviewPeriod: '',
        scores: {},
        comments: '',
    });

    // Charger les évaluations et les employés
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reviewsData, employeesData] = await Promise.all([
                    getAllReviews(),
                    getEmployees(),
                ]);
                setReviews(reviewsData);
                setEmployees(employeesData);
                console.log('Reviews:', reviewsData);
                console.log('Employees:', employeesData);
            } catch (error) {
                console.error('Erreur lors du chargement des données :', error);
            }
        };
        fetchData();
    }, []);

    // Ajouter une nouvelle évaluation
    const handleCreateReview = async () => {
        try {
            const reviewer = JSON.parse(localStorage.getItem('user')); // Récupérer les infos du reviewer
            if (!reviewer) {
                console.error('Reviewer non trouvé dans le stockage local.');
                return;
            }

            const reviewData = {
                ...newReview,
                reviewerId: reviewer.id,
                reviewerName: reviewer.name,
            };

            const createdReview = await createReview(reviewData);
            setReviews([...reviews, createdReview]); // Mettre à jour la liste
            setNewReview({
                employeeId: '',
                employeeName: '',
                reviewPeriod: '',
                scores: 0,
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
                {/* Liste déroulante pour sélectionner un employé */}
                <select
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

                {/* Sélecteur de date pour la période d'évaluation */}
                <input
                    type="month"
                    value={newReview.reviewPeriod}
                    onChange={(e) => setNewReview({ ...newReview, reviewPeriod: e.target.value })}
                />

                {/* Champ pour le score */}
                <input
                    type="number"
                    placeholder="Score"
                    value={newReview.scores}
                    onChange={(e) => setNewReview({ ...newReview, scores: parseInt(e.target.value, 10) })}
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
