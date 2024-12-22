// src/components/Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [role, setRole] = useState(null);
    const [name, setName] = useState('User');
    const navigate = useNavigate();

    // Retrieve user role and name from the user context
    useEffect(() => {
        console.log("user",user)
        if (user) {
            setRole(user.role);
            setName(user.name || 'User'); // Set default name if user.name is undefined
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleFeedClick = () => {
        console.log("role",role)
        if (role === 'employee') {
            navigate('/employee-dashboard'); // Redirect to the employee dashboard
        } else if (role === 'RH') {
            navigate('/hr-dashboard'); // Redirect to the HR dashboard
        }
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navLinks}>
                <button onClick={handleFeedClick} style={styles.navItem}>Feed</button>
                {role === 'RH' && (
                    <Link to="/hr-leave" style={styles.navItem}>Leave Requests</Link>
                )}
                {role === 'RH' && (
                    <Link to="/hr/reviews" style={styles.navItem}>Performances</Link>
                )}
                {role === 'employee' && (
                    <Link to="/employee-dashboard" style={styles.navItem}>My Leave Requests</Link>
                )}
                {role === 'employee' && (
                    <Link to="/employee/reviews" style={styles.navItem}>My Performance</Link>
                )}
            </div>
            <div style={styles.authSection}>
                {user ? (
                    <>
                        <span style={styles.welcomeMessage}>Welcome, {name}</span>
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
