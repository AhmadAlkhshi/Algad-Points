-- جدول الصفوف
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- تعديل جدول الطلاب لربطه بالصفوف
ALTER TABLE students ADD COLUMN IF NOT EXISTS grade_id INTEGER REFERENCES grades(id) ON DELETE SET NULL;

-- إنشاء index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_students_grade_id ON students(grade_id);
