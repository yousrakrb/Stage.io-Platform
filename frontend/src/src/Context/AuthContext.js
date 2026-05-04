import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = (userData) => {
        // userData should look like { role: 'Student' | 'Company' | 'University', name: '...', email: '...' }
        setUser(userData);
        // On successful login, immediately redirect to unified dashboard
        navigate('/dashboard');
    };

    const logout = () => {
        setUser(null);
        navigate('/signin');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
