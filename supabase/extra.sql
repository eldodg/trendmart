-- شغّل هذا الملف في Supabase → SQL Editor (بعد الـ Schema الأصلي)
-- ⚠️ غيّر البريد التالي إلى بريدك أنت (الأدمن الوحيد) قبل التشغيل
-- 1) أعمدة إضافية
alter table products add column if not exists pages int;
alter table products add column if not exists preview_url text;
alter table orders   add column if not exists tx_ref text;

-- 2) تشديد الصلاحيات: أي مستخدم "authenticated" لم يعد أدمن، فقط بريدك
drop policy if exists "Admin full access products" on products;
drop policy if exists "Admin full access orders"   on orders;
drop policy if exists "Public order creation"      on orders;
create policy "Admin products" on products for all
  using (auth.jwt()->>'email' = 'e.m.elhawary@gmail.com')
  with check (auth.jwt()->>'email' = 'e.m.elhawary@gmail.com');
create policy "Admin orders" on orders for all
  using (auth.jwt()->>'email' = 'e.m.elhawary@gmail.com')
  with check (auth.jwt()->>'email' = 'e.m.elhawary@gmail.com');
-- الزبون يستطيع إنشاء طلب "pending" فقط (لا يمكنه اعتماد طلبه بنفسه)
create policy "Public order creation" on orders for insert
  with check (status = 'pending' and download_expires_at is null);

-- 3) Bucket الإيصالات (خاص)
insert into storage.buckets (id, name, public) values ('receipts','receipts',false)
on conflict (id) do nothing;
create policy "Anyone uploads receipts" on storage.objects for insert
  to anon, authenticated with check (bucket_id = 'receipts');
create policy "Admin reads receipts" on storage.objects for select
  to authenticated using (bucket_id = 'receipts' and auth.jwt()->>'email' = 'e.m.elhawary@gmail.com');

-- 4) الأدمن يرفع/يحذف الملفات والأغلفة
create policy "Admin manages product files" on storage.objects for all to authenticated
  using (bucket_id in ('secure-digital-files','product-covers') and auth.jwt()->>'email' = 'e.m.elhawary@gmail.com')
  with check (bucket_id in ('secure-digital-files','product-covers') and auth.jwt()->>'email' = 'e.m.elhawary@gmail.com');
