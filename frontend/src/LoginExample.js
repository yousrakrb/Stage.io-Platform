import React, { useState } from 'react';
import { login } from './api';

const LoginExample = () => {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State for UI feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            // Call the login function from our clean api.js
            const data = await login({ email, password });
            
            // If successful, the token is already saved in localStorage by api.js
            console.log('Login successful! Backend response:', data);
            
            // Verify token storage
            const storedToken = localStorage.getItem('access_token');
            console.log('Stored token from localStorage:', storedToken);

            setSuccessMessage('Login successful! Check console to see token.');
            
            // Redirect or update app state here
            // e.g., window.location.href = '/dashboard';
            
        } catch (err) {
            console.error('Login error:', err);
            // Handle error message from backend if available
            const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Login failed. Please check your credentials.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Test Login Connection</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                
                {error && <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee' }}>{error}</div>}
                {successMessage && <div style={{ color: 'green', padding: '10px', backgroundColor: '#efe' }}>{successMessage}</div>}

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p><strong>Goal check:</strong></p>
                <ul style={{ paddingLeft: '20px' }}>
                    <li>Login from React ✅</li>
                    <li>Receive token ✅</li>
                    <li>Token stored in localStorage ✅</li>
                    <li>Confirm connection works ✅</li>
                </ul>
            </div>
        </div>
    );
};

export default LoginExample;
