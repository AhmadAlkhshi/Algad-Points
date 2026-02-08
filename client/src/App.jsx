import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [student, setStudent] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const savedStudent = localStorage.getItem('student');
    const savedAdmin = localStorage.getItem('admin');
    const token = localStorage.getItem('token');
    
    if (savedStudent && token) {
      setStudent(JSON.parse(savedStudent));
    }
    if (savedAdmin && token) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setStudent={setStudent} />} />
        <Route path="/admin/login" element={<AdminLogin setAdmin={setAdmin} />} />
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
