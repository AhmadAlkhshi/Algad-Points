# إعداد Supabase Storage لرفع الصور

## الخطوات:

### 1. إنشاء Bucket:
1. اذهب إلى Supabase Dashboard
2. من القائمة اليسرى → **Storage**
3. اضغط **Create a new bucket**
4. املأ البيانات:
   - Name: `game-images`
   - Public bucket: ✅ (فعّل)
5. اضغط **Create bucket**

---

### 2. تعيين الصلاحيات:
1. اضغط على bucket `game-images`
2. اذهب لـ **Policies**
3. اضغط **New Policy**
4. اختر **For full customization**
5. انسخ والصق:

```sql
-- السماح برفع الصور للأدمن فقط
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'game-images');

-- السماح بقراءة الصور للجميع
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'game-images');

-- السماح بحذف الصور للأدمن
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'game-images');
```

6. اضغط **Review** ثم **Save policy**

---

### 3. اختبار:
1. شغل السيرفر: `npm run dev`
2. سجل دخول كأدمن
3. اذهب لـ **الألعاب**
4. اسحب صورة للمربع
5. يجب أن ترفع تلقائياً! 🎉

---

## ملاحظات:
- حجم الصورة الأقصى: 10MB
- الصيغ المدعومة: JPG, PNG, GIF, WebP
- الصور تُخزن في Supabase بشكل دائم
