import express from 'express';
import { supabase } from '../config/supabase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// جلب كل الألعاب
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// جلب لعبة واحدة
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'لعبة غير موجودة' });
  res.json(data);
});

// إضافة لعبة
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description, points, image_url } = req.body;
  
  const { data, error } = await supabase
    .from('games')
    .insert([{ name, description, points, image_url, available: true }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// تعديل لعبة
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description, points, image_url, available } = req.body;
  
  const { data, error } = await supabase
    .from('games')
    .update({ name, description, points, image_url, available })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// حذف لعبة
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'تم الحذف' });
});

export default router;
