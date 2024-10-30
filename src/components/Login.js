import React, { useState, useContext } from 'react';
import { login as loginUser } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState(null); // État pour l'alerte
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            login(response.data);
            setAlertMessage({ type: 'success', text: 'Connexion réussie!' }); // Message de succès
        } catch (error) {
            setAlertMessage({ type: 'error', text: 'Échec de la connexion. Vérifiez vos identifiants.' }); // Message d'erreur
            console.error('Login failed', error);
        }
    };

    return (
        <div>
            {alertMessage && (
                <div
                    style={{
                        color: alertMessage.type === 'success' ? 'green' : 'red',
                        marginBottom: '1em',
                    }}
                >
                    {alertMessage.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
