import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login({ setStudent }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { studentId, password });
      localStorage.setItem('student', JSON.stringify(data.student));
      localStorage.setItem('token', data.token);
      setStudent(data.student);
      navigate('/student');
    } catch (err) {
      setError('بيانات خاطئة');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🎮</div>
          <h2>تسجيل دخول الطالب</h2>
          <p>ادخل بياناتك للوصول إلى متجر النقاط</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>رقم الطالب</label>
            <input
              type="text"
              placeholder="أدخل رقم الطالب"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
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
          <a href="/admin/login">🔒 دخول الأدمن</a>
        </div>
      </div>
    </div>
  );
}
