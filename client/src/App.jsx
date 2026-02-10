import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('student');
    return saved ? JSON.parse(saved) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={student ? <Navigate to="/student" /> : <Login setStudent={setStudent} />} 
        />
        <Route 
          path="/admin/login" 
          element={admin ? <Navigate to="/admin" /> : <AdminLogin setAdmin={setAdmin} />} 
        />
        <Route 
          path="/student" 
          element={student ? <StudentDashboard student={student} setStudent={setStudent} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin" 
          element={admin ? <AdminDashboard admin={admin} setAdmin={setAdmin} /> : <Navigate to="/admin/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
