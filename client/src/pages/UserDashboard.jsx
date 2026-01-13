import { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [measurements, setMeasurements] = useState({ height: '', chest: '', waist: '', hips: '', additionalParams: '' });
    const [reviewText, setReviewText] = useState('');
    const [reviewFile, setReviewFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, ordersRes] = await Promise.all([
                api.get('/users/me'),
                api.get('/orders')
            ]);
            setUser(userRes.data);
            setOrders(ordersRes.data);
            if (userRes.data.measurements) {
                setMeasurements(userRes.data.measurements);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${user._id}/measurements`, { measurements, fullName: user.fullName, phone: user.phone });
            alert('Профиль обновлен');
        } catch (err) {
            alert('Ошибка при обновлении');
        }
    };

    const handleLeaveReview = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('text', reviewText);
            if (reviewFile) {
                formData.append('image', reviewFile);
            }

            await api.post('/reviews', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setReviewText('');
            setReviewFile(null);
            document.getElementById('review-file').value = '';
            alert('Отзыв отправлен');
        } catch (err) {
            alert('Ошибка при отправке отзыва');
        }
    };

    if (loading) return <div className="container">Загрузка...</div>;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>Личный кабинет</h1>

            <div className="dashboard-grid">
                <div className="glass-card">
                    <h2>Мои параметры</h2>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="input-group">
                            <label>Рост (см)</label>
                            <input type="number" value={measurements.height} onChange={e => setMeasurements({ ...measurements, height: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Обхват груди (см)</label>
                            <input type="number" value={measurements.chest} onChange={e => setMeasurements({ ...measurements, chest: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Обхват талии (см)</label>
                            <input type="number" value={measurements.waist} onChange={e => setMeasurements({ ...measurements, waist: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Обхват бедер (см)</label>
                            <input type="number" value={measurements.hips} onChange={e => setMeasurements({ ...measurements, hips: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Дополнительно</label>
                            <input value={measurements.additionalParams} onChange={e => setMeasurements({ ...measurements, additionalParams: e.target.value })} placeholder="Особенности фигуры..." />
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%' }}>Сохранить</button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card">
                        <h2>Мои заказы</h2>
                        {orders.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>У вас еще нет заказов.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {orders.map(order => (
                                    <div key={order._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', borderLeft: '4px solid var(--primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{order.serviceType}</strong>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '600' }}>{order.status}</span>
                                        </div>
                                        <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Материалы: {order.materials || 'Не указаны'}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '600' }}>{order.price}₽</span>
                                            <small style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="glass-card">
                        <h2>Оставить отзыв</h2>
                        <form onSubmit={handleLeaveReview}>
                            <div className="input-group">
                                <label>Прикрепите фото изделия</label>
                                <input
                                    id="review-file"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setReviewFile(e.target.files[0])}
                                />
                            </div>
                            <div className="input-group">
                                <label>Ваш отзыв</label>
                                <textarea
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    placeholder="Расскажите о ваших впечатлениях..."
                                    required
                                />
                            </div>
                            <button type="submit" className="btn">Отправить</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
