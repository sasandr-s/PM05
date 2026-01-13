import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center' }}>Ателье</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Вход в систему</p>

                {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Логин</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%' }}>Войти</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
