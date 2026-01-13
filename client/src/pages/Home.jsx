import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get(`/reviews?page=${page}&limit=3`);
                setReviews(data.reviews);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            }
        };
        fetchReviews();
    }, [page]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await api.get('/gallery');
                setGallery(data);
            } catch (err) {
                console.error('Failed to fetch gallery:', err);
            }
        };
        fetchGallery();
    }, []);

    const handleAuthNav = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && user) {
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            navigate('/login');
        }
    };


    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content glass-card">
                    <h1>Создайте свой идеальный образ</h1>
                    <p>Индивидуальный пошив эксклюзивной одежды с любовью к каждой детали.</p>
                    <button className="btn" onClick={handleAuthNav}>Начать пошив</button>
                </div>
            </section>
            <section className="container section">
                <h2 className="section-title">Услуги и процесс работы</h2>
                <p className="section-subtitle">Мы обеспечиваем профессиональный подход на каждом этапе создания вашего идеального изделия.</p>
                <div className="services-grid">
                    <div className="service-card glass-card">
                        <span className="service-icon">📞</span>
                        <h3>Консультация клиентов</h3>
                        <ul>
                            <li>Проведение встреч с клиентами для обсуждения их пожеланий.</li>
                            <li>Помощь в выборе тканей, фасонов и стилей.</li>
                            <li>Снятие мерок и запись всех необходимых параметров.</li>
                        </ul>
                    </div>
                    <div className="service-card glass-card">
                        <span className="service-icon">✍️</span>
                        <h3>Проектирование и дизайн</h3>
                        <ul>
                            <li>Разработка эскизов и дизайн-проектов.</li>
                            <li>Подбор материалов и фурнитуры.</li>
                            <li>Создание технических чертежей и спецификаций.</li>
                        </ul>
                    </div>
                    <div className="service-card glass-card">
                        <span className="service-icon">🪡</span>
                        <h3>Пошив одежды</h3>
                        <ul>
                            <li>Раскрой тканей в соответствии с выкройками.</li>
                            <li>Пошив изделий с использованием различных технологий.</li>
                            <li>Проведение примерок и внесение корректировок.</li>
                        </ul>
                    </div>
                    <div className="service-card glass-card">
                        <span className="service-icon">✨</span>
                        <h3>Ремонт и адаптация</h3>
                        <ul>
                            <li>Исправление дефектов и замена фурнитуры.</li>
                            <li>Подгонка одежды по фигуре клиента.</li>
                            <li>Восстановление и реставрация изделий.</li>
                        </ul>
                    </div>

                    <div className="service-card glass-card">
                        <span className="service-icon">✅</span>
                        <h3>Качество и контроль</h3>
                        <ul>
                            <li>Обеспечение высокого качества пошива и отделки.</li>
                            <li>Проверка соответствия изделий стандартам и требованиям клиента.</li>
                            <li>Обработка отзывов для улучшения сервиса.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="container section">
                <h2 className="section-title">Наши работы</h2>
                <div className="gallery-grid">
                    {gallery.map(item => (
                        <div key={item._id} className="gallery-card">
                            <div className="gallery-img-container">
                                <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title} />
                            </div>
                            <div className="gallery-info">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                    {gallery.length === 0 && <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)' }}>В галерее пока нет работ.</p>}
                </div>
            </section>

            <section className="container">
                <div className="cta-section">
                    <div className="cta-content">
                        <h2>Понравились наши работы?</h2>
                        <p>Позвоните нам для уточнения деталей и сложности выполнения вашего заказа. Мы проконсультируем вас и поможем воплотить любую идею в жизнь!</p>
                        <a href="tel:+79991234567" className="phone-button">
                            <span className="phone-icon">📞</span>
                            <span>+7 (999) 123-45-67</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="container section reviews-bg">
                <h2 className="section-title">Отзывы наших клиентов</h2>
                <div className="reviews-grid">
                    {reviews.map(review => (
                        <div key={review._id} className="review-card glass-card">
                            <div className="review-header">
                                <div style={{ background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {review.client?.fullName?.[0] || 'U'}
                                </div>
                                <h4>{review.client?.fullName || 'Клиент'}</h4>
                            </div>
                            {review.imageUrl && (
                                <img
                                    src={review.imageUrl.startsWith('/uploads/') ? `http://localhost:5000${review.imageUrl}` : review.imageUrl}
                                    alt="Review"
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', margin: '1rem 0' }}
                                />
                            )}
                            <p className="review-text">"{review.text}"</p>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                        <button
                            className="btn btn-outline"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{ padding: '0.5rem 1rem' }}
                        >Назад</button>
                        <span style={{ fontWeight: '600' }}>Страница {page} из {totalPages}</span>
                        <button
                            className="btn btn-outline"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{ padding: '0.5rem 1rem' }}
                        >Вперед</button>
                    </div>
                )}
            </section>

        </div>
    );
};

export default Home;
