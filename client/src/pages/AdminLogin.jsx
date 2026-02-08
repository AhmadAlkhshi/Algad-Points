import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminLogin({ setAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/admin/login`, { username, password });
      localStorage.setItem('admin', JSON.stringify(data.admin));
      localStorage.setItem('token', data.token);
      setAdmin(data.admin);
      navigate('/admin');
    } catch (err) {
      setError('بيانات خاطئة');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔒</div>
          <h2>تسجيل دخول الأدمن</h2>
          <p>لوحة التحكم وإدارة النظام</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>اسم المستخدم</label>
            <input
              type="text"
              placeholder="أدخل اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-login">
            دخول
          </button>
        </form>
        <div className="login-footer">
          <a href="/">🎮 دخول الطالب</a>
        </div>
      </div>
    </div>
  );
}
