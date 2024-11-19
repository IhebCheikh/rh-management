import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    const loginn = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

    };

    const login = (token, userDetails) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userDetails));
        console.log("userDetails : ",userDetails)
        setUser(userDetails); // Stocke les informations utilisateur
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
