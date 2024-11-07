// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleFeedClick = () => {
        if (user) {
            if (user.role === 'employee') {
                navigate('/employee-dashboard'); // Redirige vers le tableau de bord des employés
            } else if (user.role === 'hr') {
                navigate('/hr-dashboard'); // Redirige vers le tableau de bord des responsables RH
            }
        }
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navLinks}>
                <button onClick={handleFeedClick} style={styles.navItem}>Feed</button>
                {user && <Link to="/profile" style={styles.navItem}>Profil</Link>}
            </div>
            <div style={styles.authSection}>
                {user ? (
                    <>
                        <span style={styles.welcomeMessage}>Welcome, {user.email}</span>
                        <button onClick={handleLogout} style={styles.logoutButton}>LogOut</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.navItem}>LogIn</Link>
                        <Link to="/register" style={styles.navItem}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#007BFF',
        color: 'white',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
    },
    navItem: {
        marginRight: '1rem',
        color: 'black',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'color 0.3s',
    },
    authSection: {
        display: 'flex',
        alignItems: 'center',
    },
    welcomeMessage: {
        marginRight: '1rem',
        fontSize: '16px',
    },
    logoutButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#FF4136',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
};

export default Navbar;
