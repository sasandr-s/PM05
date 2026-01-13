import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const handleAuthNav = () => {
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
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Ателье</h3>
                    <p>Мы создаем не просто одежду, а историю вашего стиля. Индивидуальный подход, премиальные ткани и безупречное качество в каждом стежке.</p>
                </div>
                <div className="footer-section">
                    <h3>Навигация</h3>
                    <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>Главная</Link>
                    <a href="/#gallery" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>Наши работы</a>
                    <a href="/#reviews" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>Отзывы</a>
                    <button onClick={handleAuthNav} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'var(--text-muted)' }}>
                        Личный кабинет
                    </button>
                </div>
                <div className="footer-section">
                    <h3>Контакты</h3>
                    <p>📍 г. Москва, ул. Кутузовский проспект, 12</p>
                    <p>📞 +7 (999) 123-45-67</p>
                    <p>✉️ info@atelier.ru</p>
                    <p>🕒 Пн-Сб: 10:00 — 20:00</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© Ателье. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;
