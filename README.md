# TrendMart — متجر المنتجات الرقمية

## هيكل المشروع
```
trendmart/
├─ index.html          المتجر (عربي/English، داكن/فاتح، السلة، الدفع)
├─ download.html       صفحة حالة الطلب والتحميل للعميل
├─ admin.html          لوحة التحكم (منتجات + طلبات)
├─ assets/ config.js   ← عدّل بياناتك هنا
│          app.js  admin.js
├─ api/download.js     دالة Vercel تُصدر رابط تحميل مؤقت (60 ثانية)
├─ supabase/extra.sql  أعمدة + صلاحيات أمان + bucket الإيصالات
└─ package.json
```

## التشغيل
1. **Supabase:** شغّل `supabase/extra.sql` (بعد تغيير بريد الأدمن). أنشئ مستخدم الأدمن من Authentication → Users، ثم **عطّل التسجيل العام** من Authentication → Sign In / Providers (Allow new users to sign up = off).
2. **الإعدادات:** عدّل `assets/config.js` (رابط Supabase و anon key وحسابات الدفع).
3. **GitHub:** ارفع المجلد كاملًا إلى Repository جديد.
4. **Vercel:** Add New → Project → اختر الـ Repo → أضف Environment Variables: `SUPABASE_URL` و `SUPABASE_SERVICE_KEY` (من Project Settings → API → service_role) → Deploy.

## كيف يعمل
- العميل يدفع، يرفع الإيصال/رقم العملية → يُسجَّل طلب `pending` ويظهر زر واتساب جاهز بتفاصيل الطلب.
- من `/admin.html` تراجع الإيصال وتضغط **قبول** → يظهر زر **إرسال واتساب** برابط تحميل خاص بالعميل (صالح 30 يومًا، والملف نفسه يُسلَّم عبر رابط مؤقت 60 ثانية).
- إضافة منتج جديد = من لوحة التحكم فقط (عنوان، سعر، غلاف، ملف) بدون تعديل كود.

## قبل الإطلاق
- استبدل الآراء في `index.html` بآراء عملاء حقيقيين.
- المتجر يعمل بمنتجات تجريبية إلى أن تضبط Supabase.
- لا تضع `service_role` في أي ملف داخل المشروع أبدًا.
