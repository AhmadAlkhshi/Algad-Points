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
  const { name, grade_id, section, points, password, phone } = req.body;
  
  // جلب اسم الصف
  let gradeName = null;
  if (grade_id) {
    const { data: gradeData } = await supabase
      .from('grades')
      .select('name')
      .eq('id', grade_id)
      .single();
    gradeName = gradeData?.name;
  }
  
  // توليد رقم الطالب تلقائياً
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('student_id')
    .eq('grade_id', grade_id)
    .order('student_id', { ascending: false })
    .limit(1);

  let studentId;
  if (students && students.length > 0) {
    const lastId = parseInt(students[0].student_id);
    studentId = (lastId + 1).toString();
  } else {
    studentId = (grade_id * 10000 + 1).toString();
  }

  // توليد كلمة مرور عشوائية 8 أرقام
  const generatedPassword = password || Math.floor(10000000 + Math.random() * 90000000).toString();
  
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);
  const initialPoints = points || 0;
  
  const { data, error } = await supabase
    .from('students')
    .insert([{ 
      student_id: studentId, 
      password: hashedPassword, 
      plain_password: generatedPassword,
      name, 
      grade_id,
      grade: gradeName,
      section,
      phone,
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
  const { name, grade, section, points, debt, phone } = req.body;
  
  const { data, error } = await supabase
    .from('students')
    .update({ name, grade, section, points, debt, phone })
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
