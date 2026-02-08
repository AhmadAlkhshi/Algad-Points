import express from 'express';
import { supabase } from '../config/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// شراء لعبة
router.post('/', verifyToken, async (req, res) => {
  const { student_id, game_id, use_debt } = req.body;

  if (req.user.role !== 'student' || req.user.id !== student_id) {
    return res.status(403).json({ error: 'غير مصرح' });
  }

  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('id', student_id)
    .single();

  if (studentError) return res.status(404).json({ error: 'طالب غير موجود' });

  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('*')
    .eq('id', game_id)
    .single();

  if (gameError) return res.status(404).json({ error: 'لعبة غير موجودة' });

  const basePoints = student.initial_points || student.points;
  const maxDebt = Math.floor(basePoints * 0.1);
  const availableDebt = maxDebt - student.debt;
  const totalAvailable = student.points + (use_debt ? availableDebt : 0);

  if (totalAvailable < game.points) {
    return res.status(400).json({ error: 'نقاط غير كافية' });
  }

  let newPoints = student.points;
  let newDebt = student.debt;
  let usedDebt = false;

  if (use_debt && student.points < game.points) {
    const debtNeeded = game.points - student.points;
    if (debtNeeded > availableDebt) {
      return res.status(400).json({ error: 'تجاوزت الحد الأقصى للدين' });
    }
    newPoints = 0;
    newDebt += debtNeeded;
    usedDebt = true;
  } else {
    newPoints -= game.points;
  }

  const { error: updateError } = await supabase
    .from('students')
    .update({ points: newPoints, debt: newDebt })
    .eq('id', student_id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert([{
      student_id,
      game_id,
      points_paid: game.points,
      used_debt: usedDebt
    }])
    .select()
    .single();

  if (purchaseError) return res.status(500).json({ error: purchaseError.message });

  res.json({ purchase, newPoints, newDebt });
});

// جلب مشتريات طالب
router.get('/student/:student_id', verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      games (name, image_url, points)
    `)
    .eq('student_id', req.params.student_id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// جلب كل المشتريات (للأدمن)
router.get('/', verifyToken, async (req, res) => {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      games (name, image_url, points),
      students (name, student_id)
    `)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// حذف عملية شراء (للأدمن)
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح - أدمن فقط' });
  }

  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('*, students(*), games(*)')
    .eq('id', req.params.id)
    .single();

  if (purchaseError) return res.status(404).json({ error: 'عملية شراء غير موجودة' });

  const student = purchase.students;
  const game = purchase.games;

  let newPoints = student.points + game.points;
  let newDebt = student.debt;

  if (purchase.used_debt) {
    const debtAmount = Math.min(game.points, student.debt);
    newDebt = Math.max(0, student.debt - debtAmount);
    newPoints = student.points + (game.points - debtAmount);
  }

  const { error: updateError } = await supabase
    .from('students')
    .update({ points: newPoints, debt: newDebt })
    .eq('id', student.id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  const { error: deleteError } = await supabase
    .from('purchases')
    .delete()
    .eq('id', req.params.id);

  if (deleteError) return res.status(500).json({ error: deleteError.message });

  res.json({ message: 'تم الحذف وإرجاع النقاط', newPoints, newDebt });
});

export default router;
