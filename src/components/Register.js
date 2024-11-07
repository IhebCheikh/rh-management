// src/components/Register.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { register as registerUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee'); // Default role
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(name, email, password, role);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h1 style={styles.title}>
                    <FontAwesomeIcon icon={faUserPlus} /> Register
                </h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputContainer}>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter Name..."
                            style={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                    <div style={styles.inputContainer}>
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={styles.input}
                        >
                            <option value="employee">Employee</option>
                            <option value="RH">HR</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" style={styles.registerButton}>
                        <FontAwesomeIcon icon={faUserPlus} /> Register
                    </button>
                </form>
                <div style={styles.loginLink}>
                    <a
                        href="#"
                        onClick={() => navigate('/login')}
                        style={styles.loginText}
                    >
                        <strong>Already have an account? Login</strong>
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
    registerButton: {
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
    loginLink: {
        marginTop: '15px',
    },
    loginText: {
        color: '#6a11cb',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default Register;
