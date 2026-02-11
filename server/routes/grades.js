import express from 'express';
import { supabase } from '../config/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// جلب كل الصفوف
router.get('/', verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// إضافة صف جديد
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح - أدمن فقط' });
  }

  const { name } = req.body;

  const { data, error } = await supabase
    .from('grades')
    .insert([{ name }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// تعديل صف
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح - أدمن فقط' });
  }

  const { name } = req.body;

  const { data, error } = await supabase
    .from('grades')
    .update({ name })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// حذف صف
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح - أدمن فقط' });
  }

  const { error } = await supabase
    .from('grades')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'تم الحذف بنجاح' });
});

export default router;
