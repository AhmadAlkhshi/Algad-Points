# PointsMarket - نظام استبدال النقاط

## المميزات
- تسجيل دخول للطلاب والأدمن
- عرض الألعاب مع الصور والأسعار
- نظام الدين (10% من النقاط)
- لوحة تحكم للأدمن (إدارة الطلاب والألعاب)
- سجل المشتريات

## التقنيات
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL)

## التثبيت

### 1. إعداد Supabase
1. سجل في [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. نفذ السكيما من `server/supabase-schema.sql`
4. احصل على URL و Service Key

### 2. Backend
```bash
cd server
npm install
```

أنشئ ملف `.env`:
```
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key
PORT=5000
```

شغل السيرفر:
```bash
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

## الاستضافة على Vercel

### Backend
```bash
cd server
vercel
```

### Frontend
```bash
cd client
vercel
```

## بيانات الدخول الافتراضية
- Admin: `admin` / `admin123`
