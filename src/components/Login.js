// src/components/Login.js
import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { login as loginUser } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            console.log(response); // Check the structure of the response
            console.log(response.token); // Check the structure of the response
            const token = response.token;

            if (!token) {
                throw new Error("Token is missing in the response");
            }

            // Store token and decode it to get user details
            login(token);

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id; // Assurez-vous que `id` est bien le champ contenant l'ID

            localStorage.setItem('userId', userId); // Stocker l'ID dans le localStorage
            console.log(decodedToken); // Check the structure of the response
            // Make an additional call to get user details
            if (decodedToken.role === 'RH') {
                navigate('/hr-dashboard');
            } else {
                navigate('/employee-dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed: Please check your credentials or try again later');
        }
    };

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h1 style={styles.title}>
                    <FontAwesomeIcon icon={faUser} /> Login
                </h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputContainer}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email..."
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.inputContainer}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Password..."
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" style={styles.loginButton}>
                        <FontAwesomeIcon icon={faRightToBracket} /> Login
                    </button>
                </form>
                <div style={styles.signupLink}>
                    <a
                        href="#"
                        onClick={() => navigate('/register')}
                        style={styles.signupText}
                    >
                        <strong>Don't have an account? Sign Up</strong>
                    </a>
                </div>
            </div>
        </div>
    );
}

const styles = {
    background: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    },
    container: {
        width: '350px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    },
    inputContainer: {
        marginBottom: '15px',
        textAlign: 'left',
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        marginTop: '5px',
    },
    loginButton: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#6a11cb',
        border: 'none',
        borderRadius: '4px',
        marginTop: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    signupLink: {
        marginTop: '15px',
    },
    signupText: {
        color: '#6a11cb',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default Login;
