-- إضافة عمود كلمة المرور الأصلية (غير مشفرة) للعرض فقط
ALTER TABLE students ADD COLUMN IF NOT EXISTS plain_password TEXT;
