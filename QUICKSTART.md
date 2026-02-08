# 🚀 البدء السريع

## خطوات الإعداد (5 دقائق):

### 1️⃣ إعداد Supabase
اتبع الدليل المفصل في: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

باختصار:
1. سجل في https://supabase.com
2. أنشئ مشروع جديد
3. نفذ SQL من `server/supabase-schema.sql`
4. احصل على URL و Service Key

---

### 2️⃣ إعداد Backend

```bash
cd server

# نسخ ملف البيئة
copy .env.template .env

# عدل .env وضع:
# - SUPABASE_URL
# - SUPABASE_SERVICE_KEY
# - JWT_SECRET (أي نص عشوائي)

# تثبيت المكتبات
npm install

# اختبار الاتصال
npm run test-db

# تشفير الباسوردات
npm run hash-passwords

# تشغيل السيرفر
npm run dev
```

---

### 3️⃣ إعداد Frontend

```bash
cd client

# تثبيت المكتبات
npm install

# تشغيل التطبيق
npm run dev
```

---

### 4️⃣ تسجيل الدخول

افتح: http://localhost:5173

**Admin:**
- Username: `admin`
- Password: `admin123`

---

## 📋 الأوامر المفيدة:

```bash
# Backend
npm run dev          # تشغيل السيرفر
npm run test-db      # اختبار الاتصال بقاعدة البيانات
npm run hash-passwords  # تشفير الباسوردات

# Frontend
npm run dev          # تشغيل التطبيق
npm run build        # بناء للإنتاج
```

---

## 🆘 مشاكل شائعة:

### "Invalid API key"
✅ تأكد من نسخ `service_role` key وليس `anon`

### "relation does not exist"
✅ نفذ SQL في Supabase SQL Editor

### "بيانات خاطئة" عند الدخول
✅ شغل `npm run hash-passwords`

### السيرفر لا يشتغل
✅ شغل `npm run test-db` للتحقق من الإعداد

---

## 📁 هيكل المشروع:

```
PointsMarket/
├── server/              # Backend (Node.js)
│   ├── routes/         # API endpoints
│   ├── middleware/     # JWT auth
│   ├── config/         # Supabase config
│   └── .env           # إعدادات (لا تشاركه!)
│
├── client/             # Frontend (React)
│   ├── src/
│   │   ├── pages/     # الصفحات
│   │   └── api.js     # Axios + JWT
│   └── .env           # API URL
│
└── README.md          # الوثائق
```

---

## 🎯 الخطوات التالية:

1. ✅ أضف طلاب من لوحة الأدمن
2. ✅ أضف ألعاب مع صور
3. ✅ جرب الشراء بالنقاط والدين
4. 🚀 استضف على Vercel

---

**جاهز؟** ابدأ من **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** 🚀
