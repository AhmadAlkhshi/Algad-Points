import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// تسجيل دخول طالب
router.post('/login', async (req, res) => {
  const { studentId, password } = req.body;
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: 'بيانات خاطئة' });
  }

  const isValid = await bcrypt.compare(password, data.password);
  if (!isValid) {
    return res.status(401).json({ error: 'بيانات خاطئة' });
  }

  const token = jwt.sign(
    { id: data.id, role: 'student' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...studentData } = data;
  res.json({ student: studentData, token });
});

// تسجيل دخول أدمن
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: 'بيانات خاطئة' });
  }

  const isValid = await bcrypt.compare(password, data.password);
  if (!isValid) {
    return res.status(401).json({ error: 'بيانات خاطئة' });
  }

  const token = jwt.sign(
    { id: data.id, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...adminData } = data;
  res.json({ admin: adminData, token });
});

export default router;
