import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [reviewPage, setReviewPage] = useState(1);
    const [totalReviewPages, setTotalReviewPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showClientModal, setShowClientModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('orders');
    const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });

    const [newGalleryItem, setNewGalleryItem] = useState({ title: '', description: '', image: null });

    const [newClient, setNewClient] = useState({
        username: '',
        password: '',
        fullName: '',
        phone: '',
        email: '',
        measurements: { height: '', chest: '', waist: '', hips: '' }
    });
    const [newOrder, setNewOrder] = useState({ client: '', serviceType: '', price: '', deadline: '', materials: '' });

    useEffect(() => {
        fetchData();
    }, [reviewPage]);

    const fetchData = async () => {
        try {
            const [ordersRes, clientsRes, reviewsRes, galleryRes] = await Promise.all([
                api.get('/orders'),
                api.get('/users'),
                api.get(`/reviews?page=${reviewPage}&limit=6`),
                api.get('/gallery')
            ]);
            setOrders(ordersRes.data);
            setClients(clientsRes.data);
            setReviews(reviewsRes.data.reviews);
            setTotalReviewPages(reviewsRes.data.totalPages);
            setGallery(galleryRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleCreateGalleryItem = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newGalleryItem.title);
            formData.append('description', newGalleryItem.description);
            formData.append('image', newGalleryItem.image);

            await api.post('/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setShowGalleryModal(false);
            setNewGalleryItem({ title: '', description: '', image: null });
            fetchData();
        } catch (err) {
            alert('Ошибка при добавлении в галерею');
        }
    };

    const deleteGalleryItem = async (id) => {
        if (confirm('Удалить эту работу из галереи?')) {
            try {
                await api.delete(`/gallery/${id}`);
                fetchData();
            } catch (err) {
                alert('Ошибка при удалении');
            }
        }
    };

    const deleteReview = async (id) => {
        if (confirm('Удалить этот отзыв?')) {
            try {
                await api.delete(`/reviews/${id}`);
                fetchData();
            } catch (err) {
                alert('Ошибка при удалении');
            }
        }
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { ...newClient, role: 'user' });
            setShowClientModal(false);
            setNewClient({
                username: '',
                password: '',
                fullName: '',
                phone: '',
                email: '',
                measurements: { height: '', chest: '', waist: '', hips: '' }
            });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create client');
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            await api.post('/orders', newOrder);
            setShowOrderModal(false);
            setNewOrder({ client: '', serviceType: '', price: '', deadline: '', materials: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create order');
        }
    };

    const handleUpdateOrder = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/orders/${editingOrder._id}`, editingOrder);
            setEditingOrder(null);
            fetchData();
        } catch (err) {
            alert('Failed to update order');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}`, { status });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const deleteClient = async (id) => {
        if (confirm('Удалить клиента и все его данные?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchData();
            } catch (err) {
                alert('Ошибка при удалении');
            }
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedClients = [...clients].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'createdAt') {
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return ' ↕';
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>Панель управления</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className={`btn ${activeTab === 'orders' ? '' : 'btn-outline'}`} onClick={() => setActiveTab('orders')}>Заказы</button>
                <button className={`btn ${activeTab === 'clients' ? '' : 'btn-outline'}`} onClick={() => setActiveTab('clients')}>Клиенты</button>
                <button className={`btn ${activeTab === 'reviews' ? '' : 'btn-outline'}`} onClick={() => setActiveTab('reviews')}>Отзывы</button>
                <button className={`btn ${activeTab === 'gallery' ? '' : 'btn-outline'}`} onClick={() => setActiveTab('gallery')}>Галерея</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className="btn" onClick={() => setShowClientModal(true)}>+ Добавить клиента</button>
                <button className="btn" onClick={() => setShowOrderModal(true)}>+ Создать заказ</button>
                <button className="btn" onClick={() => setShowGalleryModal(true)}>+ Добавить в галерею</button>
            </div>

            {activeTab === 'orders' && (
                <div className="glass-card">
                    <h2>Список заказов</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '1rem' }}>Клиент</th>
                                    <th style={{ padding: '1rem' }}>Услуга</th>
                                    <th style={{ padding: '1rem' }}>Статус</th>
                                    <th style={{ padding: '1rem' }}>Цена</th>
                                    <th style={{ padding: '1rem' }}>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>{order.client?.fullName}</td>
                                        <td style={{ padding: '1rem' }}>{order.serviceType}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                background: 'rgba(99, 102, 241, 0.2)',
                                                fontSize: '0.875rem'
                                            }}>{order.status}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{order.price}₽</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => setEditingOrder(order)}
                                                style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}
                                            >Изменить</button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Удалить заказ?')) {
                                                        await api.delete(`/orders/${order._id}`);
                                                        fetchData();
                                                    }
                                                }}
                                                style={{ background: '#ef4444', border: 'none', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                                            >Удалить</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'clients' && (
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>База клиентов</h2>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Всего: {clients.length}</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                                    <th
                                        style={{ padding: '1rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        onClick={() => handleSort('fullName')}
                                    >
                                        Клиент{getSortIndicator('fullName')}
                                    </th>
                                    <th style={{ padding: '1rem' }}>Контакты</th>
                                    <th style={{ padding: '1rem' }}>Мерки (Р/Г/Т/Б)</th>
                                    <th style={{ padding: '1rem' }}>Доп. параметры</th>
                                    <th
                                        style={{ padding: '1rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        Дата рег.{getSortIndicator('createdAt')}
                                    </th>
                                    <th style={{ padding: '1rem' }}>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedClients.map(client => (
                                    <tr key={client._id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <strong>{client.fullName}</strong><br />
                                            <small style={{ color: 'var(--text-muted)' }}>@{client.username}</small>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.9rem' }}>{client.phone || '—'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.email || '—'}</div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                            {client.measurements ? (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.2rem 0.5rem' }}>
                                                    <span>Р: {client.measurements.height || '—'}</span>
                                                    <span>Г: {client.measurements.chest || '—'}</span>
                                                    <span>Т: {client.measurements.waist || '—'}</span>
                                                    <span>Б: {client.measurements.hips || '—'}</span>
                                                </div>
                                            ) : '—'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{
                                                fontSize: '0.85rem',
                                                maxWidth: '200px',
                                                maxHeight: '60px',
                                                overflowY: 'auto',
                                                lineHeight: '1.4'
                                            }}>
                                                {client.measurements?.additionalParams || '—'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                            {new Date(client.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => deleteClient(client._id)}
                                                className="btn"
                                                style={{ background: '#ef4444', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            >Удалить</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="glass-card">
                    <h2>Управление отзывами</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                        {reviews.map(review => (
                            <div key={review._id} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <strong>{review.client?.fullName}</strong>
                                    <button onClick={() => deleteReview(review._id)} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Удалить</button>
                                </div>
                                {review.imageUrl && (
                                    <img src={review.imageUrl.startsWith('/uploads/') ? `http://localhost:5000${review.imageUrl}` : review.imageUrl} alt="Review" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                                )}
                                <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>"{review.text}"</p>
                                <small style={{ color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                            </div>
                        ))}
                        {reviews.length === 0 && <p>Отзывов пока нет.</p>}
                    </div>

                    {totalReviewPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setReviewPage(p => Math.max(1, p - 1))}
                                disabled={reviewPage === 1}
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                            >Назад</button>
                            <span style={{ fontSize: '0.9rem' }}>Стр. {reviewPage} из {totalReviewPages}</span>
                            <button
                                className="btn btn-outline"
                                onClick={() => setReviewPage(p => Math.min(totalReviewPages, p + 1))}
                                disabled={reviewPage === totalReviewPages}
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                            >Вперед</button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'gallery' && (
                <div className="glass-card">
                    <h2>Управление галереей</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                        {gallery.map(item => (
                            <div key={item._id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                                <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                <div style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <strong>{item.title}</strong>
                                        <button onClick={() => deleteGalleryItem(item._id)} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Удалить</button>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showGalleryModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(253, 242, 248, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                        <h3>Добавить работу</h3>
                        <form onSubmit={handleCreateGalleryItem}>
                            <div className="input-group">
                                <label>Название</label>
                                <input value={newGalleryItem.title} onChange={e => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Описание</label>
                                <input value={newGalleryItem.description} onChange={e => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label>Фото</label>
                                <input type="file" accept="image/*" onChange={e => setNewGalleryItem({ ...newGalleryItem, image: e.target.files[0] })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>Загрузить</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowGalleryModal(false)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showClientModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(253, 242, 248, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>Новый клиент</h3>
                        <form onSubmit={handleCreateClient}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label>ФИО</label>
                                    <input value={newClient.fullName} onChange={e => setNewClient({ ...newClient, fullName: e.target.value })} required />
                                </div>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input type="email" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label>Логин</label>
                                    <input value={newClient.username} onChange={e => setNewClient({ ...newClient, username: e.target.value })} required />
                                </div>
                                <div className="input-group">
                                    <label>Пароль</label>
                                    <input type="password" value={newClient.password} onChange={e => setNewClient({ ...newClient, password: e.target.value })} required />
                                </div>
                                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Телефон</label>
                                    <input value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} />
                                </div>
                            </div>

                            <h4 style={{ margin: '1rem 0 0.5rem' }}>Мерки клиента</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label>Рост</label>
                                    <input type="number" value={newClient.measurements.height} onChange={e => setNewClient({ ...newClient, measurements: { ...newClient.measurements, height: e.target.value } })} />
                                </div>
                                <div className="input-group">
                                    <label>Грудь</label>
                                    <input type="number" value={newClient.measurements.chest} onChange={e => setNewClient({ ...newClient, measurements: { ...newClient.measurements, chest: e.target.value } })} />
                                </div>
                                <div className="input-group">
                                    <label>Талия</label>
                                    <input type="number" value={newClient.measurements.waist} onChange={e => setNewClient({ ...newClient, measurements: { ...newClient.measurements, waist: e.target.value } })} />
                                </div>
                                <div className="input-group">
                                    <label>Бедра</label>
                                    <input type="number" value={newClient.measurements.hips} onChange={e => setNewClient({ ...newClient, measurements: { ...newClient.measurements, hips: e.target.value } })} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>Создать</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowClientModal(false)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showOrderModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(253, 242, 248, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                        <h3>Новый заказ</h3>
                        <form onSubmit={handleCreateOrder}>
                            <div className="input-group">
                                <label>Клиент</label>
                                <select
                                    value={newOrder.client}
                                    onChange={e => setNewOrder({ ...newOrder, client: e.target.value })}
                                    required
                                >
                                    <option value="">Выберите клиента</option>
                                    {clients.map(c => <option key={c._id} value={c._id}>{c.fullName}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Тип услуги</label>
                                <input value={newOrder.serviceType} onChange={e => setNewOrder({ ...newOrder, serviceType: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Цена</label>
                                <input type="number" value={newOrder.price} onChange={e => setNewOrder({ ...newOrder, price: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Материалы</label>
                                <input value={newOrder.materials} onChange={e => setNewOrder({ ...newOrder, materials: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>Создать</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowOrderModal(false)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingOrder && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(253, 242, 248, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                        <h3>Редактировать заказ</h3>
                        <form onSubmit={handleUpdateOrder}>
                            <div className="input-group">
                                <label>Статус</label>
                                <select
                                    value={editingOrder.status}
                                    onChange={e => setEditingOrder({ ...editingOrder, status: e.target.value })}
                                >
                                    <option value="Принят">Принят</option>
                                    <option value="В работе">В работе</option>
                                    <option value="Примерка">Примерка</option>
                                    <option value="Готов к выдаче">Готов к выдаче</option>
                                    <option value="Выдан">Выдан</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Тип услуги</label>
                                <input value={editingOrder.serviceType} onChange={e => setEditingOrder({ ...editingOrder, serviceType: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Цена</label>
                                <input type="number" value={editingOrder.price} onChange={e => setEditingOrder({ ...editingOrder, price: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Материалы</label>
                                <input value={editingOrder.materials} onChange={e => setEditingOrder({ ...editingOrder, materials: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn" style={{ flex: 1 }}>Сохранить</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditingOrder(null)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
