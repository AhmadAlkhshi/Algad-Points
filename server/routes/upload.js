import express from 'express';
import { supabase } from '../config/supabase.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// رفع صورة
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { file, fileName } = req.body;
    
    if (!file || !fileName) {
      return res.status(400).json({ error: 'الملف مطلوب' });
    }
    
    // تحويل base64 إلى buffer
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const uniqueName = `${Date.now()}_${fileName.replace(/\s/g, '_')}`;
    
    // رفع الصورة لـ Supabase Storage
    const { data, error } = await supabase.storage
      .from('game-images2')
      .upload(uniqueName, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(400).json({ error: error.message });
    }

    // الحصول على الرابط العام
    const { data: urlData } = supabase.storage
      .from('game-images2')
      .getPublicUrl(data.path);

    res.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
