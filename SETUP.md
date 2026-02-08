# دليل الإعداد - PointsMarket

## 1️⃣ إعداد Supabase

### خطوات:
1. سجل في [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. اذهب إلى SQL Editor
4. نفذ السكيما من `server/supabase-schema.sql`
5. احصل على:
   - Project URL من Settings > API
   - Service Role Key من Settings > API

---

## 2️⃣ إعداد Backend

### التثبيت:
```bash
cd server
npm install
```

### إعداد .env:
أنشئ ملف `.env` في مجلد `server`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
PORT=5000
JWT_SECRET=your_random_secret_key_here
```

**مهم:** غير `JWT_SECRET` لقيمة عشوائية قوية!

### تشفير كلمات المرور:
بعد تنفيذ السكيما، شغل:
```bash
npm run hash-passwords
```
هذا يشفر كلمة مرور الأدمن الافتراضية.

### تشغيل السيرفر:
```bash
npm run dev
```

---

## 3️⃣ إعداد Frontend

### التثبيت:
```bash
cd client
npm install
```

### إعداد .env:
ملف `.env` موجود، تأكد من:
```env
VITE_API_URL=http://localhost:5000
```

### تشغيل التطبيق:
```bash
npm run dev
```

---

## 4️⃣ بيانات الدخول الافتراضية

**Admin:**
- Username: `admin`
- Password: `admin123`

**الطلاب:** يضيفهم الأدمن

---

## 5️⃣ الاستضافة على Vercel

### Backend:
```bash
cd server
vercel
```
- أضف Environment Variables في Vercel Dashboard
- انسخ الـ URL

### Frontend:
```bash
cd client
vercel
```
- أضف `VITE_API_URL` في Environment Variables
- استخدم URL الـ Backend

---

## ✅ التحسينات المضافة:

1. **🔐 تشفير كلمات المرور** - bcrypt
2. **🎫 JWT Authentication** - توكنات آمنة
3. **🛡️ حماية Routes** - middleware للتحقق
4. **🔒 Authorization** - صلاحيات للأدمن والطلاب

---

## 📝 ملاحظات:

- غير `JWT_SECRET` قبل الإنتاج
- لا تشارك `SUPABASE_SERVICE_KEY`
- استخدم HTTPS في الإنتاج
