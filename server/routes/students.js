import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// جلب كل الطلاب
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// جلب طالب واحد
router.get('/:id', verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'طالب غير موجود' });
  res.json(data);
});

// إضافة طالب
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { student_id, password, name, grade, section, points } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const initialPoints = points || 0;
  
  const { data, error } = await supabase
    .from('students')
    .insert([{ 
      student_id, 
      password: hashedPassword, 
      plain_password: password,
      name, 
      grade, 
      section, 
      points: initialPoints,
      initial_points: initialPoints,
      debt: 0 
    }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// تعديل طالب
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { name, grade, section, points, debt } = req.body;
  
  const { data, error } = await supabase
    .from('students')
    .update({ name, grade, section, points, debt })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// حذف طالب
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'تم الحذف' });
});

export default router;
