# 🚀 دليل إعداد Supabase - خطوة بخطوة

## الطريقة 1️⃣: من الموقع (الأسهل)

### 1. إنشاء حساب ومشروع:
1. اذهب إلى: https://supabase.com
2. اضغط **Start your project**
3. سجل دخول بـ GitHub
4. اضغط **New Project**
5. املأ البيانات:
   - Name: `PointsMarket`
   - Database Password: احفظها!
   - Region: اختر الأقرب لك
6. اضغط **Create new project**
7. انتظر 2-3 دقائق

---

### 2. تنفيذ السكيما:
1. من القائمة الجانبية → **SQL Editor**
2. اضغط **New query**
3. انسخ والصق الكود التالي:

```sql
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

-- إضافة أدمن افتراضي (سيتم تشفيره لاحقاً)
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');
```

4. اضغط **Run** (أو Ctrl+Enter)
5. تأكد من ظهور: **Success. No rows returned**

---

### 3. الحصول على المفاتيح:

#### الخطوة الأولى - فتح صفحة API:
1. من القائمة الجانبية اليسرى في Supabase
2. اضغط على أيقونة **⚙️ Settings** (الإعدادات) في الأسفل
3. من القائمة الفرعية اختر **API**

#### الخطوة الثانية - نسخ Project URL:
1. في قسم **Project URL** في الأعلى
2. انسخ الرابط (مثل: `https://abcdefgh.supabase.co`)
3. احفظه - هذا هو `SUPABASE_URL`

#### الخطوة الثالثة - نسخ Service Role Key:
1. انزل للأسفل لقسم **Project API keys**
2. ابحث عن **service_role** (مش anon!)
3. المفتاح مخفي - اضغط على أيقونة **👁️ Reveal** أو **Show**
4. انسخ المفتاح الطويل (يبدأ بـ `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
5. احفظه - هذا هو `SUPABASE_SERVICE_KEY`

**⚠️ تحذير مهم:**
- لا تنسخ `anon` key - لازم `service_role`
- المفتاح حساس جداً - لا تشاركه مع أحد
- لا ترفعه على GitHub

---

### 4. إعداد ملف .env:
في مجلد `server`، أنشئ ملف `.env`:

```env
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYzOTU4ODAwMCwiZXhwIjoxOTU1MTY0MDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
JWT_SECRET=my_super_secret_key_12345
```

**مثال توضيحي:**
- استبدل `https://abcdefgh.supabase.co` بالـ URL الخاص بك
- استبدل المفتاح الطويل بمفتاحك من Supabase

**مهم:** غير `JWT_SECRET` لقيمة عشوائية!

---

### 5. تثبيت المكتبات:
```bash
cd server
npm install
```

---

### 6. تشفير كلمة مرور الأدمن:
```bash
npm run hash-passwords
```

يجب أن ترى:
```
✅ تم تشفير كلمة مرور الأدمن
✅ انتهى التشفير
```

---

### 7. تشغيل السيرفر:
```bash
npm run dev
```

يجب أن ترى:
```
Server running on port 5000
```

---

### 8. تشغيل Frontend:
في نافذة terminal جديدة:
```bash
cd client
npm install
npm run dev
```

---

## ✅ اختبار:
1. افتح المتصفح: http://localhost:5173
2. اضغط **دخول الأدمن**
3. سجل دخول:
   - Username: `admin`
   - Password: `admin123`

---

## الطريقة 2️⃣: باستخدام Supabase CLI (متقدم)

### 1. تثبيت CLI:
```bash
npm install -g supabase
```

### 2. تسجيل الدخول:
```bash
supabase login
```

### 3. ربط المشروع:
```bash
cd server
supabase link --project-ref your-project-ref
```

### 4. تنفيذ السكيما:
```bash
supabase db push
```

---

## 🆘 حل المشاكل:

### خطأ: "Invalid API key"
- تأكد من نسخ `service_role` وليس `anon`

### خطأ: "relation already exists"
- الجداول موجودة مسبقاً، تجاهل الخطأ

### خطأ: "بيانات خاطئة" عند الدخول
- شغل `npm run hash-passwords` مرة ثانية

---

## 📞 تواصل:
إذا واجهت مشكلة، أرسل لي screenshot من:
1. Supabase Table Editor
2. رسالة الخطأ في Console
