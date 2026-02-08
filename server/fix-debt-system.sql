-- إضافة عمود النقاط الأولية لحساب الدين بشكل ثابت
ALTER TABLE students ADD COLUMN IF NOT EXISTS initial_points INTEGER DEFAULT 0;

-- تحديث النقاط الأولية للطلاب الموجودين
UPDATE students SET initial_points = points WHERE initial_points = 0;
