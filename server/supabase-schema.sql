-- جدول الأدمن
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول الطلاب
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  grade TEXT,
  section TEXT,
  points INTEGER DEFAULT 0,
  debt INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول الألعاب
CREATE TABLE games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول المشتريات
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  points_paid INTEGER NOT NULL,
  used_debt BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- إضافة أدمن افتراضي
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');
