import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <nav className="main-nav">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="logo">
                    Ателье
                </Link>
                <div className="nav-actions">
                    {location.pathname === '/' ? (
                        <button className="btn btn-outline" onClick={handleAuthNav}>ЛК</button>
                    ) : location.pathname === '/login' ? (
                        <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600' }}>На главную</Link>
                    ) : (
                        <div className="nav-actions">
                            <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>На главную</Link>
                            <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Выйти</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
