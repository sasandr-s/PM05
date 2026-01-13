import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
